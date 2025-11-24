import React, { useEffect, useRef } from 'react';

interface WaveBackgroundProps {
  isDarkMode: boolean;
}

export const WaveBackground: React.FC<WaveBackgroundProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const activeRef = useRef(false); 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;
    let animationFrameId: number;

    // Configuration for the waves
    // Increased opacity for dark mode to make them more visible/vibrant
    const darkWaves = [
      { color: 'rgba(41, 151, 255, 0.6)', speed: 0.002, frequency: 0.001, amplitude: 100 }, // Bright Blue
      { color: 'rgba(192, 132, 252, 0.5)', speed: 0.003, frequency: 0.002, amplitude: 80 }, // Purple
      { color: 'rgba(255, 255, 255, 0.25)', speed: 0.001, frequency: 0.0015, amplitude: 40 }, // White Accent
      { color: 'rgba(41, 151, 255, 0.3)', speed: 0.004, frequency: 0.003, amplitude: 120 }, // Secondary Blue
    ];

    // Saturated colors for light mode
    const lightWaves = [
      { color: 'rgba(41, 151, 255, 0.4)', speed: 0.002, frequency: 0.001, amplitude: 100 },
      { color: 'rgba(147, 51, 234, 0.3)', speed: 0.003, frequency: 0.002, amplitude: 80 },
      { color: 'rgba(0, 0, 0, 0.1)', speed: 0.001, frequency: 0.0015, amplitude: 40 },
      { color: 'rgba(41, 151, 255, 0.1)', speed: 0.004, frequency: 0.003, amplitude: 120 },
    ];

    const waves = isDarkMode ? darkWaves : lightWaves;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      activeRef.current = true;
      targetMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      activeRef.current = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    resize();

    const animate = () => {
      const ease = 0.05;
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * ease;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * ease;

      ctx.clearRect(0, 0, width, height);
      
      time += 1;

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.moveTo(0, height / 2);

        for (let x = 0; x < width; x += 5) {
          const baseNoise = Math.sin(x * wave.frequency + time * wave.speed);
          const dx = x - mouseRef.current.x;
          const dist = Math.abs(dx);
          const interactionRadius = width * 0.4;
          let interactionFactor = 0;
          
          if (activeRef.current && dist < interactionRadius) {
             const closeness = (interactionRadius - dist) / interactionRadius;
             interactionFactor = closeness * closeness * (3 - 2 * closeness);
          }
          
          const mouseYOffset = activeRef.current 
            ? (mouseRef.current.y - height/2) * 0.3 * interactionFactor 
            : 0;

          const dynamicAmplitude = wave.amplitude + (activeRef.current ? interactionFactor * 50 : 0);
          const y = (height / 2) + (baseNoise * dynamicAmplitude) + mouseYOffset;

          ctx.lineTo(x, y);
        }

        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]); // Re-run when mode changes

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};
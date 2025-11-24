import React from 'react';
import { Language } from '../types';

const LINKS = {
  en: { privacy: "Privacy", twitter: "Twitter", contact: "Contact", tagline: "Designed for focus." },
  zh: { privacy: "隐私政策", twitter: "Twitter", contact: "联系我们", tagline: "为专注而设计。" },
  ja: { privacy: "プライバシー", twitter: "Twitter", contact: "お問い合わせ", tagline: "集中のためにデザインされた。" }
};

export const Footer: React.FC<{ lang: Language }> = ({ lang }) => (
  <footer className="py-12 bg-zinc-100 dark:bg-black text-zinc-500 dark:text-zinc-600 text-xs text-center transition-colors duration-500">
    <p className="mb-4">{LINKS[lang].tagline}</p>
    <div className="flex justify-center gap-6">
      <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-400 transition-colors">{LINKS[lang].privacy}</a>
      <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-400 transition-colors">{LINKS[lang].twitter}</a>
      <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-400 transition-colors">{LINKS[lang].contact}</a>
    </div>
    <p className="mt-8 opacity-50">© 2024 Villdo AI.</p>
  </footer>
);
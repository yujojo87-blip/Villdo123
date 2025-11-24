import React from 'react';

export type Language = 'en' | 'zh' | 'ja';

export enum DemoMode {
  PROFESSIONAL_EMAIL = 'Professional Email',
  SLACK_MESSAGE = 'Slack Update',
  PERSONAL_NOTE = 'Personal Note',
  CODE_COMMENT = 'Code Documentation',
  CREATIVE_WRITING = 'Creative Writing'
}

export interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colSpan?: string;
  lang: Language;
}

export interface InteractiveDemoProps {
  lang: Language;
}

export interface CommonProps {
  lang: Language;
}
import { createContext } from 'react';

export interface AnnouncerContextValue {
  announce: (message: string) => void;
}

export const AnnouncerContext = createContext<AnnouncerContextValue | null>(null);

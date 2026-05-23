import { useContext } from 'react';
import { AnnouncerContext } from '../context/AnnouncerContext';

interface AnnouncerContextValue {
  announce: (message: string) => void;
}

export function useAnnouncer(): AnnouncerContextValue {
  const ctx = useContext(AnnouncerContext);
  if (!ctx) {
    throw new Error('useAnnouncer must be used within an AnnouncerProvider');
  }
  return ctx;
}

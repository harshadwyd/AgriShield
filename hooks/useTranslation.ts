import { useAppContext } from '../context/AppContext';
import { getTranslation, Language } from '../constants/translations';

export const useTranslation = () => {
  const { state } = useAppContext();
  const currentLanguage = state.settings.language as Language;

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = getTranslation(currentLanguage, key);
    
    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(paramValue));
      });
    }
    
    return translation;
  };

  const formatNumber = (num: number): string => {
    // Format numbers according to language locale
    switch (currentLanguage) {
      case 'hi':
        return new Intl.NumberFormat('hi-IN').format(num);
      case 'mr':
        return new Intl.NumberFormat('mr-IN').format(num);
      default:
        return new Intl.NumberFormat('en-US').format(num);
    }
  };

  const formatDate = (date: Date | number): string => {
    const dateObj = typeof date === 'number' ? new Date(date) : date;
    
    switch (currentLanguage) {
      case 'hi':
        return dateObj.toLocaleDateString('hi-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'mr':
        return dateObj.toLocaleDateString('mr-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      default:
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
    }
  };

  const isRTL = (): boolean => {
    // None of our supported languages are RTL, but this is here for future expansion
    return false;
  };

  return {
    t,
    formatNumber,
    formatDate,
    isRTL,
    currentLanguage
  };
};
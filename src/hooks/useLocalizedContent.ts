import { useTranslation } from 'react-i18next';
import type { LocalizedString } from '../types/product';
import { getLocalizedString } from '../types/product';

export const useLocalizedContent = () => {
  const { i18n } = useTranslation();
  
  const getLocalized = (localizedString: LocalizedString): string => {
    return getLocalizedString(localizedString, i18n.language);
  };

  return {
    getLocalized,
    currentLanguage: i18n.language,
  };
};

export default useLocalizedContent;

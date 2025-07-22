import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
    </div>
  );
}

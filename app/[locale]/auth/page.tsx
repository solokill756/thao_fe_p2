import { getDictionary } from '@/app/lib/get-dictionary';
import AuthContainer from './RenderAuthContainer';

interface AuthPageProps {
  params: Promise<{
    locale: 'en' | 'vi';
  }>;
}

export default async function RenderAuthPage({ params }: AuthPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return <AuthContainer dictionary={dictionary} locale={locale} />;
}

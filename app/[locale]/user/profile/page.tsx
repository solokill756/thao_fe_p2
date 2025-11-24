import { getDictionary } from '@/app/lib/get-dictionary';
import UserProfileClient from './components/UserProfileClient';

type Props = {
  params: Promise<{ locale: 'en' | 'vi' }>;
};

export default async function RenderUserProfilePage({ params }: Props) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return <UserProfileClient locale={locale} dictionary={dictionary} />;
}

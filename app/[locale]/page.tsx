import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/authOptions';

type Props = {
  params: Promise<{ locale: 'en' | 'vi' }>;
};

export default async function RenderHomePage({ params }: Props) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  // Nếu đã đăng nhập, redirect về user home
  if (session) {
    redirect(`/${locale}/user/home`);
  }

  // Nếu chưa đăng nhập, redirect về trang auth
  redirect(`/${locale}/auth`);
}

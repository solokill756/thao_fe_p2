import Link from 'next/link';
import { DictType } from '../../lib/types/dictType';
import HeaderAuthSection from './HeaderAuthSection';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import { getUserById } from '@/app/lib/services/userService';

const HEADER_CONTENT = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
  {
    label: 'Tours',
    href: '/tours/search',
  },
  {
    label: 'Destinations',
    href: '/destinations',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
];

interface RenderHeaderProps {
  locale: 'en' | 'vi';
  dictionary: DictType;
}

export default async function RenderHeader({
  locale,
  dictionary,
}: RenderHeaderProps) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const userProfile = user ? await getUserById(Number(user?.id)) : null;
  return (
    <header className="bg-white/90 sticky top-0 z-50 shadow-md backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <div className="text-2xl font-bold text-blue-600">
          Travel<span className="text-orange-500">.</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex space-x-8 text-gray-600 font-medium">
          {HEADER_CONTENT.map((item) => (
            <Link
              key={item.label}
              href={`/${locale}/${item.href}`}
              className="hover:text-blue-600 transition duration-150"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Auth/Profile Section */}
        <HeaderAuthSection
          locale={locale}
          dictionary={dictionary}
          userProfile={userProfile}
        />
      </div>
    </header>
  );
}

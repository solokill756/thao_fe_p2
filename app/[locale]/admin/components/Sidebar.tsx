'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Map,
  CalendarCheck,
  MessageSquare,
  PieChart,
  List,
  DollarSign,
  LogOut,
} from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import {
  ADMIN_BOOKINGS_CONSTANTS,
  PLACEHOLDER_IMAGES,
} from '@/app/lib/constants';
import toast from 'react-hot-toast';
import { useNavigation } from '../contexts/NavigationContext';

interface SidebarProps {
  dictionary: DictType;
  locale: 'en' | 'vi';
}

interface NavItemProps {
  icon: React.ReactElement;
  text: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, text, href, isActive, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-left ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: 'w-5 h-5',
      })}
      <span className="font-medium">{text}</span>
    </button>
  );
};

export default function Sidebar({ dictionary, locale }: SidebarProps) {
  const sidebarDict = dictionary.admin?.sidebar;
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [activePath, setActivePath] = useState(pathname);
  const { push, refresh } = useNavigation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: `/${locale}/`,
      });
      if (typeof window !== 'undefined') {
        document.cookie.split(';').forEach((cookie) => {
          const eqPos = cookie.indexOf('=');
          const name =
            eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
          if (name.startsWith('next-auth')) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          }
        });
        localStorage.clear();
        sessionStorage.clear();
      }
      push(`/${locale}/`);
      refresh();
      toast.success(
        dictionary.useProfile?.logoutSuccess ||
          sidebarDict?.logoutSuccess ||
          'Logged out successfully!'
      );
    } catch (error) {
      console.error('Logout error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      toast.error(sidebarDict?.logoutFailed || 'Logout failed');
    }
  };

  const navItems = [
    {
      icon: <LayoutDashboard />,
      text:
        sidebarDict?.dashboard ||
        ADMIN_BOOKINGS_CONSTANTS.DASHBOARD ||
        'Dashboard',
      href: `/${locale}/admin/dashboard`,
    },
    {
      icon: <CalendarCheck />,
      text:
        sidebarDict?.manageBookings ||
        ADMIN_BOOKINGS_CONSTANTS.MANAGE_BOOKINGS ||
        'Manage Bookings',
      href: `/${locale}/admin/bookings`,
    },
    {
      icon: <Map />,
      text: sidebarDict?.manageTours || ADMIN_BOOKINGS_CONSTANTS.MANAGE_TOURS,
      href: `/${locale}/admin/tours`,
    },
    {
      icon: <Users />,
      text: sidebarDict?.manageUsers || ADMIN_BOOKINGS_CONSTANTS.MANAGE_USERS,
      href: `/${locale}/admin/users`,
    },
  ];

  const statsItems = [
    {
      icon: <MessageSquare />,
      text: sidebarDict?.userReviews || ADMIN_BOOKINGS_CONSTANTS.USER_REVIEWS,
      href: `/${locale}/admin/reviews`,
    },
    {
      icon: <List />,
      text: sidebarDict?.categories || ADMIN_BOOKINGS_CONSTANTS.CATEGORIES,
      href: `/${locale}/admin/categories`,
    },
    {
      icon: <DollarSign />,
      text: sidebarDict?.revenue || ADMIN_BOOKINGS_CONSTANTS.REVENUE,
      href: `/${locale}/admin/revenue`,
    },
    {
      icon: <PieChart />,
      text: sidebarDict?.reports || ADMIN_BOOKINGS_CONSTANTS.REPORTS,
      href: `/${locale}/admin/reports`,
    },
  ];

  const isActive = (href: string) =>
    activePath === href || activePath.startsWith(href + '/');

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 hidden lg:flex flex-col">
      <div className="p-6 text-2xl font-bold text-blue-400 border-b border-slate-800 flex items-center">
        Travel<span className="text-orange-500">.</span>{' '}
        <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
          {sidebarDict?.adminBadge || ADMIN_BOOKINGS_CONSTANTS.ADMIN_BADGE}
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase mb-2 mt-2">
          {sidebarDict?.mainMenu || ADMIN_BOOKINGS_CONSTANTS.MAIN_MENU}
        </div>
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            text={item.text}
            href={item.href}
            isActive={isActive(item.href)}
            onClick={() => {
              setActivePath(item.href);
              push(item.href);
            }}
          />
        ))}

        <div className="text-xs font-semibold text-slate-500 uppercase mb-2 mt-6">
          {sidebarDict?.contentAndStats ||
            ADMIN_BOOKINGS_CONSTANTS.CONTENT_AND_STATS}
        </div>
        {statsItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            text={item.text}
            href={item.href}
            isActive={isActive(item.href)}
            onClick={() => {
              setActivePath(item.href);
              push(item.href);
            }}
          />
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800">
          <img
            src={
              isMounted && session?.user?.image
                ? session.user.image
                : PLACEHOLDER_IMAGES.ADMIN_AVATAR
            }
            alt="Admin"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {isMounted && session?.user?.name
                ? session.user.name
                : sidebarDict?.adminUser || ADMIN_BOOKINGS_CONSTANTS.ADMIN_USER}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {isMounted && session?.user?.email
                ? session.user.email
                : sidebarDict?.adminEmail ||
                  ADMIN_BOOKINGS_CONSTANTS.ADMIN_EMAIL}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>{sidebarDict?.logout || 'Logout'}</span>
        </button>
      </div>
    </div>
  );
}

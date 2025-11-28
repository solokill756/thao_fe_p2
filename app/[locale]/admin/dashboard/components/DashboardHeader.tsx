import { Bell } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '@/app/lib/constants';
import type { Session } from 'next-auth';

interface DashboardHeaderProps {
  title: string;
  session: Session | null;
}

export default function DashboardHeader({
  title,
  session,
}: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-20 px-8 py-4 flex justify-between items-center">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <img
          src={session?.user?.image || PLACEHOLDER_IMAGES.ADMIN_AVATAR}
          alt="Admin"
          className="w-9 h-9 rounded-full border border-slate-200"
        />
      </div>
    </header>
  );
}

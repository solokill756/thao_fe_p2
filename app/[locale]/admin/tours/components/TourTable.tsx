'use client';

import React from 'react';
import {
  MapPin,
  Clock,
  Star,
  Edit,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import type { TourWithRelations } from '@/app/actions/admin/getToursAction';
import { PLACEHOLDER_IMAGES } from '@/app/lib/constants';
import Image from 'next/image';

interface TourTableProps {
  tours: TourWithRelations[];
  dictionary: DictType;
  locale: 'en' | 'vi';
  onEdit: (tour: TourWithRelations) => void;
  onDelete: (tourId: number) => void;
}

export default function TourTable({
  tours,
  dictionary,
  locale,
  onEdit,
  onDelete,
}: TourTableProps) {
  const adminDict = dictionary.admin?.tours || {};

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const localeString = locale === 'vi' ? 'vi-VN' : 'en-US';
    return dateObj.toLocaleDateString(localeString);
  };

  if (tours.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl border border-slate-100 p-12 text-center text-slate-500">
        <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p>
          {adminDict.noToursFound || 'No tours found matching your search.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <th className="p-4 border-b">
              {adminDict.tourInfo || 'Tour Info'}
            </th>
            <th className="p-4 border-b">{adminDict.location || 'Location'}</th>
            <th className="p-4 border-b">
              {adminDict.priceAndDuration || 'Price & Duration'}
            </th>
            <th className="p-4 border-b">{adminDict.category || 'Category'}</th>
            <th className="p-4 border-b">{adminDict.bookings || 'Bookings'}</th>
            <th className="p-4 border-b text-right">
              {adminDict.actions || 'Actions'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tours.map((tour) => {
            const primaryCategory = tour.categories[0]?.category?.name || 'N/A';
            const primaryDestination =
              tour.destinations[0]?.destination?.name || 'N/A';

            return (
              <tr key={tour.tour_id} className="hover:bg-slate-50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 rounded overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        loading="lazy"
                        src={tour.cover_image_url || PLACEHOLDER_IMAGES.TOUR}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                        width={64}
                        height={48}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 line-clamp-1 w-40">
                        {tour.title}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />{' '}
                        {tour.averageRating?.toFixed(1) || '0.0'} (
                        {tour._count.reviews})
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {tour.departure_location || primaryDestination}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-bold text-slate-900">
                    ${tour.price_per_person.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center mt-0.5">
                    <Clock className="w-3 h-3 mr-1" /> {tour.duration_days}{' '}
                    {adminDict.days || 'Days'}
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {primaryCategory}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm text-slate-900">
                    {tour._count.bookings}
                  </div>
                  <div className="text-xs text-slate-500">
                    {adminDict.maxGuests || 'Max'}: {tour.max_guests}
                  </div>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(tour)}
                    className="p-1.5 border border-slate-200 text-slate-600 rounded hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                    title={adminDict.edit || 'Edit'}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(tour.tour_id)}
                    className="p-1.5 border border-slate-200 text-slate-600 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                    title={adminDict.delete || 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

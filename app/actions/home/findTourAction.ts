'use server';

import { redirect } from 'next/navigation';

export interface FindTourFormData {
  destination?: string;
  date?: string;
  guests?: string;
}

export async function findTourAction(formData: FormData) {
  const destination = formData.get('destination') as string | null;
  const date = formData.get('date') as string | null;
  const guests = formData.get('guests') as string | null;

  const searchParams = new URLSearchParams();

  if (destination) {
    searchParams.set('destination', destination);
  }
  if (date) {
    searchParams.set('date', date);
  }
  if (guests) {
    searchParams.set('guests', guests);
  }

  redirect(`/tours/search?${searchParams.toString()}`);
}

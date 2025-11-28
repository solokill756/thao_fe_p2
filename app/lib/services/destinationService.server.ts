import { Destination } from '../types/tourTypes';
import { fetchDestinations } from './destinationService';
import { cacheTag } from 'next/cache';

export const getDestinations = async (): Promise<Destination[]> => {
  'use cache';
  cacheTag('destinations');
  return fetchDestinations();
};

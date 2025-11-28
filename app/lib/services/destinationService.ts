import prisma from '../prisma';
import { Destination } from '../types/tourTypes';

export const fetchDestinations = async (): Promise<Destination[]> => {
  try {
    const destinations = await prisma.destination.findMany();
    return destinations.map((destination) => ({
      destination_id: destination.destination_id,
      name: destination.name,
      country: destination.country,
      image_url: destination.image_url,
      description: destination.description,
    }));
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
};

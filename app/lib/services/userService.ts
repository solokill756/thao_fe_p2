import { Role, AuthProvider } from '@prisma/client';
import prisma from '../prisma';
import { UserWithStats } from '../types/userType';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
};

export const createUser = async (
  fullName: string,
  email: string,
  hashedPassword: string,
  role: Role = 'user' as Role
) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        full_name: fullName,
        email,
        password_hash: hashedPassword,
        role,
      },
    });
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
};

export const createUserFromGoogle = async (
  fullName: string,
  email: string,
  providerId: string,
  avatarUrl?: string,
  role: Role = 'user' as Role
) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        full_name: fullName,
        email,
        auth_provider: AuthProvider.google,
        provider_id: providerId,
        avatar_url: avatarUrl,
        role,
      },
    });
    return newUser;
  } catch (error) {
    console.error('Error creating user from Google:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
};

export const getUserById = async (userId: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    return user;
  } catch (error) {
    console.error(`Error fetching user with id ${userId}:`, error);
    throw error;
  }
};

export const updateUser = async (
  userId: number,
  data: {
    full_name?: string;
    phone_number?: string | null;
  }
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        ...(data.full_name && { full_name: data.full_name }),
        ...(data.phone_number !== undefined && {
          phone_number: data.phone_number || null,
        }),
        updated_at: new Date(),
      },
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
};

export const fetchAdminUsers = async (): Promise<UserWithStats[]> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        bookings: {
          include: {
            payment: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return users.map((user) => {
      const completedBookings = user.bookings.filter(
        (booking) => booking.payment?.status === 'completed'
      );
      const totalSpent = completedBookings.reduce(
        (sum, booking) => sum + Number(booking.total_price || 0),
        0
      );

      return {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        avatar_url: user.avatar_url,
        role: user.role,
        auth_provider: user.auth_provider,
        created_at: user.created_at,
        updated_at: user.updated_at,
        bookingsCount: user.bookings.length,
        totalSpent,
      };
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};

export const updateUserStatus = async (
  userId: number,
  role: Role
): Promise<void> => {
  try {
    await prisma.user.update({
      where: { user_id: userId },
      data: {
        role,
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
};

export const deleteUserById = async (userId: number): Promise<void> => {
  try {
    await prisma.user.delete({
      where: { user_id: userId },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
};

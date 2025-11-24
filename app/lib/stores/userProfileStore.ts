import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfileState {
  name: string | null;
  email: string | null;
  image: string | null;
  phoneNumber: string | null;

  // Actions
  setUser: (user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    phoneNumber?: string | null;
  }) => void;
  updateName: (name: string) => void;
  updatePhoneNumber: (phoneNumber: string | null) => void;
  clearUser: () => void;
}

const initialState = {
  name: null,
  email: null,
  image: null,
  phoneNumber: null,
};

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) =>
        set({
          name: user.name ?? null,
          email: user.email ?? null,
          image: user.image ?? null,
          phoneNumber: user.phoneNumber ?? null,
        }),

      updateName: (name) => set({ name }),

      updatePhoneNumber: (phoneNumber) => set({ phoneNumber }),

      clearUser: () => set(initialState),
    }),
    {
      name: 'user-profile-storage',
    }
  )
);

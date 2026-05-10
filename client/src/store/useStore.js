import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      isDonationModalOpen: false,
      donationPresetAmount: null,
      openDonationModal: (amount = null) => set({ isDonationModalOpen: true, donationPresetAmount: amount }),
      closeDonationModal: () => set({ isDonationModalOpen: false, donationPresetAmount: null }),
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null });
      },
      lang: 'en',
      toggleLang: () => set((state) => ({ lang: state.lang === 'en' ? 'hi' : 'en' }))
    }),
    {
      name: 'humari-umeed-storage',
      partialize: (state) => ({ user: state.user, lang: state.lang }),
    }
  )
);

export default useStore;

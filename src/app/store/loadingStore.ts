import { create } from 'zustand';

interface LoadingStore {
  isLoading: boolean;
  loadingStates: Record<string, boolean>;
  setLoading: (loading: boolean) => void;
  setLoadingState: (key: string, loading: boolean) => void;
  isLoadingKey: (key: string) => boolean;
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  isLoading: false,
  loadingStates: {},

  // Global loading state
  setLoading: (loading) => set({ isLoading: loading }),

  // Specific loading states for different features
  setLoadingState: (key, loading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading,
      },
    })),

  // Check if specific feature is loading
  isLoadingKey: (key) => get().loadingStates[key] || false,
})); 
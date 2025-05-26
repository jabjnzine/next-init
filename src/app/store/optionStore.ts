import { create } from 'zustand';
import { fetchWrapper } from '../utils/fetchWrapper';
import { useLoadingStore } from './loadingStore';

interface Option {
  id: number;
  // add other option fields here
}

interface OptionStore {
  options: Option[];
  selectedOption: Option | null;
  error: string | null;
  
  // Actions
  setError: (error: string | null) => void;
  setOptions: (options: Option[]) => void;
  setSelectedOption: (option: Option | null) => void;
  
  // API calls
  fetchOptions: () => Promise<void>;
  fetchOptionById: (id: string) => Promise<void>;
  createOption: (data: Partial<Option>) => Promise<Option>;
  updateOption: (data: Partial<Option>) => Promise<Option>;
  deleteOption: (id: string) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/options';

export const useOptionStore = create<OptionStore>((set, get) => ({
  options: [],
  selectedOption: null,
  error: null,

  setError: (error) => set({ error }),
  setOptions: (options) => set({ options }),
  setSelectedOption: (option) => set({ selectedOption: option }),

  fetchOptions: async () => {
    try {
      useLoadingStore.getState().setLoadingState('options', true);
      set({ error: null });
      const response = await fetchWrapper<Option[]>(`${API_URL}`, {
        method: 'GET',
        requireAuth: true,
      });
      set({ options: response });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      useLoadingStore.getState().setLoadingState('options', false);
    }
  },

  fetchOptionById: async (id) => {
    try {
      useLoadingStore.getState().setLoadingState('optionDetail', true);
      set({ error: null });
      const response = await fetchWrapper<Option>(`${API_URL}/${id}`, {
        method: 'GET',
        requireAuth: true,
      });
      set({ selectedOption: response });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      useLoadingStore.getState().setLoadingState('optionDetail', false);
    }
  },

  createOption: async (data) => {
    try {
      useLoadingStore.getState().setLoadingState('optionCreate', true);
      set({ error: null });
      const response = await fetchWrapper<Option>(`${API_URL}`, {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify(data),
      });
      const currentOptions = get().options;
      set({ options: [...currentOptions, response] });
      return response;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      useLoadingStore.getState().setLoadingState('optionCreate', false);
    }
  },

  updateOption: async (data) => {
    try {
      useLoadingStore.getState().setLoadingState('optionUpdate', true);
      set({ error: null });
      const response = await fetchWrapper<Option>(`${API_URL}`, {
        method: 'PATCH',
        requireAuth: true,
        body: JSON.stringify(data),
      });
      const currentOptions = get().options;
      set({
        options: currentOptions.map((item) =>
          item.id === response.id ? response : item
        ),
      });
      return response;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      useLoadingStore.getState().setLoadingState('optionUpdate', false);
    }
  },

  deleteOption: async (id) => {
    try {
      useLoadingStore.getState().setLoadingState('optionDelete', true);
      set({ error: null });
      await fetchWrapper(`${API_URL}/${id}`, {
        method: 'DELETE',
        requireAuth: true,
      });
      const currentOptions = get().options;
      set({
        options: currentOptions.filter((item) => item.id.toString() !== id),
      });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      useLoadingStore.getState().setLoadingState('optionDelete', false);
    }
  },
})); 
import { useOptionStore, useLoadingStore } from '../store';

export const useOptions = () => {
  const store = useOptionStore();
  const loadingStore = useLoadingStore();
  
  const getAll = async () => {
    await store.fetchOptions();
    return store.options;
  };

  const getOne = async (id: string) => {
    await store.fetchOptionById(id);
    return store.selectedOption;
  };

  const create = async (data: any) => {
    return await store.createOption(data);
  };

  const update = async (data: any) => {
    return await store.updateOption(data);
  };

  const deletes = async (id: string) => {
    return await store.deleteOption(id);
  };

  return {
    // State
    options: store.options,
    selectedOption: store.selectedOption,
    error: store.error,
    
    // Loading states
    isLoading: loadingStore.isLoading,
    isLoadingOptions: loadingStore.isLoadingKey('options'),
    isLoadingDetail: loadingStore.isLoadingKey('optionDetail'),
    isLoadingCreate: loadingStore.isLoadingKey('optionCreate'),
    isLoadingUpdate: loadingStore.isLoadingKey('optionUpdate'),
    isLoadingDelete: loadingStore.isLoadingKey('optionDelete'),
    
    // Methods
    getAll,
    getOne,
    create,
    update,
    deletes,
  };
};

export default useOptions; 
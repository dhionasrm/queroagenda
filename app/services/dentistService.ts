export const dentistService = {
  create: async (payload: any) => {
    // Faz o POST real para o backend
    return await $fetch('/api/dentistas', {
      method: 'POST',
      body: payload,
      // headers: { Authorization: `Bearer ${seuToken}` }
    });
  },
  
  delete: async (id: string) => {
    return await $fetch(`/api/dentistas/${id}`, {
      method: 'DELETE',
    });
  }
};
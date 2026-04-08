export const appointmentService = {
  create: async (data: any) => {
    console.log("Mock: Consulta salva", data);
    return { success: true };
  }
};
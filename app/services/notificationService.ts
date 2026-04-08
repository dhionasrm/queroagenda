// app/services/notificationService.ts
export const notificationService = {
  send: async (data: any) => {
    console.log("Mock: Notificação enviada", data);
    return { success: true };
  }
};
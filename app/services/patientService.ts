// app/services/patientService.ts
export const patientService = {
  getAll: async () => {
    console.log("Mock: Buscando pacientes");
    return [
      { id: '1', nome: 'João da Silva', telefone: '(11) 99999-9999' },
      { id: '2', nome: 'Maria Oliveira', telefone: '(11) 88888-8888' }
    ];
  },
  
  // Adicione esta função:
  create: async (data: any) => {
    console.log("Mock: Paciente salvo", data);
    return { success: true };
  }
};
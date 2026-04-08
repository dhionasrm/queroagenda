// app/schemas/forms.ts (ou schemas/forms.ts)
import { z } from 'zod';

export const appointmentSchema = z.object({
  pacienteId: z.string().min(1, "Selecione o paciente"),
  dentistaId: z.string().min(1, "Selecione o dentista"),
  data: z.string().min(1, "A data é obrigatória"),
  hora: z.string().min(1, "O horário é obrigatório"),
  procedimento: z.string().min(3, "Informe o procedimento"),
  observacoes: z.string().optional(),
});

export type AppointmentForm = z.infer<typeof appointmentSchema>;

export const patientSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().min(11, "CPF inválido").optional(),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("E-mail inválido").optional(),
  dataNascimento: z.string().optional(),
});

export type PatientForm = z.infer<typeof patientSchema>;

// Adicione junto aos outros schemas
export const dentistSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  cro: z.string().min(4, "CRO inválido"),
  especialidade: z.string().optional(),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
});

export type DentistForm = z.infer<typeof dentistSchema>;


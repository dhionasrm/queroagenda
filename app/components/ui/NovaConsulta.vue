<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
      
      <div class="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Nova consulta</h2>
          <p class="text-sm text-gray-500 mt-1">Preencha os dados para agendar uma nova consulta.</p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <form id="form-nova-consulta" @submit.prevent="handleSubmit" class="space-y-4">
          
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700">Paciente *</label>
              <select 
                v-model="formData.patient_id" 
                :disabled="pendingPacientes"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white disabled:bg-gray-50 disabled:text-gray-500 text-sm"
              >
                <option value="" disabled>{{ pendingPacientes ? 'Carregando...' : 'Selecione o paciente' }}</option>
                <option v-for="paciente in pacientes" :key="paciente.id" :value="paciente.id">
                  {{ paciente.nome }}
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700">Dentista *</label>
              <select 
                v-model="formData.dentist_id" 
                :disabled="pendingDentistas"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white disabled:bg-gray-50 disabled:text-gray-500 text-sm"
              >
                <option value="" disabled>{{ pendingDentistas ? 'Carregando...' : 'Selecione o dentista' }}</option>
                <option v-for="dentista in dentistas" :key="dentista.id" :value="dentista.id">
                  {{ dentista.nome }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-12">
            <div class="space-y-1.5 col-span-12 md:col-span-6">
              <label class="text-sm font-medium text-gray-700">Data e Horário *</label>
              <input 
                type="datetime-local" 
                v-model="formData.appointment_date" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>

            <div class="space-y-1.5 col-span-6 md:col-span-3">
              <label class="text-sm font-medium text-gray-700">Duração (min)</label>
              <input 
                type="number" 
                min="15" step="15"
                v-model="formData.duration_minutes" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>

            <div class="space-y-1.5 col-span-6 md:col-span-3">
              <label class="text-sm font-medium text-gray-700">Valor (R$)</label>
              <input 
                type="number" 
                min="0" step="0.01" placeholder="0.00"
                v-model="formData.valor_previsto" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700">Procedimento</label>
              <input 
                type="text" 
                placeholder="Ex: Limpeza, Extração"
                v-model="formData.treatment_type" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700">Convênio</label>
              <input 
                type="text" 
                placeholder="Ex: Unimed, Bradesco..."
                v-model="formData.convenio" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Origem do Agendamento</label>
            <select 
              v-model="formData.origem_agendamento" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white text-sm"
            >
              <option value="" disabled>Selecione a origem</option>
              <option value="recepcao">Recepção</option>
              <option value="portal_paciente">Portal do Paciente</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telefone">Telefone</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Observações</label>
            <textarea 
              v-model="formData.notes" 
              rows="3" 
              placeholder="Observações adicionais..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none text-sm"
            ></textarea>
          </div>

        </form>
      </div>

      <div class="p-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
        <button 
          type="button" 
          @click="closeModal" 
          :disabled="isLoading"
          class="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          form="form-nova-consulta"
          :disabled="isLoading"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm text-sm"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          {{ isLoading ? "Salvando..." : "Agendar" }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['update:isOpen', 'success'])

// Buscando dados reais do banco
const { data: pacientes, pending: pendingPacientes } = await useFetch('/api/pacientes')
const { data: dentistas, pending: pendingDentistas } = await useFetch('/api/dentistas')

const isLoading = ref(false)

const formData = reactive({
  patient_id: "",
  dentist_id: "",
  appointment_date: "",
  duration_minutes: 60,
  treatment_type: "",
  convenio: "",
  valor_previsto: "" as string | number,
  origem_agendamento: "",
  notes: "",
})

const resetForm = () => {
  Object.assign(formData, {
    patient_id: "", dentist_id: "", appointment_date: "",
    duration_minutes: 60, treatment_type: "", convenio: "",
    valor_previsto: "", origem_agendamento: "", notes: "",
  })
}

const closeModal = () => {
  emit('update:isOpen', false)
  resetForm()
}

const handleSubmit = async () => {
  if (!formData.patient_id || !formData.dentist_id || !formData.appointment_date) {
    toast.error("Preencha todos os campos obrigatórios")
    return
  }

  isLoading.value = true
  try {
    // Calculando a data de fim com base na duração
    const dataHoraInicio = new Date(formData.appointment_date)
    const dataHoraFim = new Date(dataHoraInicio.getTime() + formData.duration_minutes * 60000)

    // Prepara o objeto para a API
    const payload = {
      pacienteId: Number(formData.patient_id),
      dentistaId: Number(formData.dentist_id),
      dataHoraInicio: dataHoraInicio.toISOString(),
      dataHoraFim: dataHoraFim.toISOString(),
      procedimento: formData.treatment_type || null,
      convenio: formData.convenio || null,
      valorPrevisto: formData.valor_previsto ? Number(formData.valor_previsto) : null,
      origemAgendamento: formData.origem_agendamento || null,
      observacoes: formData.notes || null,
    }

    // Chamada real para o nosso banco de dados
    await $fetch('/api/agendamentos', {
      method: 'POST',
      body: payload
    })

    toast.success("Consulta agendada com sucesso!")
    emit('success')
    closeModal()
  } catch (error: any) {
    console.error("Erro ao criar consulta:", error)
    toast.error("Erro ao agendar consulta no banco de dados.")
  } finally {
    isLoading.value = false
  }
}
</script>
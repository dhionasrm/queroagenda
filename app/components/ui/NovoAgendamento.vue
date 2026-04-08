<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
      
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Novo Agendamento</h2>
          <p class="text-sm text-gray-500 mt-1">Marque uma nova consulta no sistema</p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <form id="appointmentForm" @submit.prevent="handleSubmit" class="grid gap-5">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
              <select v-model="formData.pacienteId" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Selecione um paciente</option>
              <option v-for="p in pacientes" :key="p.id" :value="String(p.id)">{{ p.nome }}</option>
              </select>
              <p v-if="errors.pacienteId" class="text-xs text-red-500 mt-1">{{ errors.pacienteId }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dentista *</label>
              <select v-model="formData.dentistaId" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">Selecione um dentista</option>
              <option v-for="d in dentistas" :key="d.id" :value="String(d.id)">{{ d.nome }}</option>
              </select>
              <p v-if="errors.dentistaId" class="text-xs text-red-500 mt-1">{{ errors.dentistaId }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data da Consulta *</label>
              <div class="relative">
                <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input v-model="formData.data" type="date" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <p v-if="errors.data" class="text-xs text-red-500 mt-1">{{ errors.data }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
              <div class="relative">
                <Clock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input v-model="formData.hora" type="time" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <p v-if="errors.hora" class="text-xs text-red-500 mt-1">{{ errors.hora }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Procedimento *</label>
            <input v-model="formData.procedimento" type="text" placeholder="Ex: Limpeza, Canal, Avaliação" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            <p v-if="errors.procedimento" class="text-xs text-red-500 mt-1">{{ errors.procedimento }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Observações (Opcional)</label>
            <textarea v-model="formData.observacoes" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
          </div>
        </form>
      </div>

      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
        <button @click="closeModal" type="button" class="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors">Cancelar</button>
        <button form="appointmentForm" type="submit" :disabled="isLoading" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium disabled:opacity-50 flex items-center gap-2">
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          {{ isLoading ? 'Agendando...' : 'Confirmar Agendamento' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X, Calendar, Clock, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { appointmentSchema } from '@/schemas/forms'
import { z } from 'zod'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['update:isOpen', 'success'])

const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

// Busca pacientes e dentistas reais da API
const { data: pacientes } = await useFetch<{ id: number; nome: string }[]>('/api/pacientes')
const { data: dentistas } = await useFetch<{ id: number; nome: string }[]>('/api/dentistas')

const formData = reactive({
  pacienteId: '',
  dentistaId: '',
  data: '',
  hora: '',
  procedimento: '',
  observacoes: ''
})

const closeModal = () => {
  Object.assign(formData, { pacienteId: '', dentistaId: '', data: '', hora: '', procedimento: '', observacoes: '' })
  errors.value = {}
  emit('update:isOpen', false)
}

const handleSubmit = async () => {
  errors.value = {}
  try {
    appointmentSchema.parse(formData)
    isLoading.value = true

    // Monta o ISO 8601 a partir dos campos separados de data e hora
    const dataHoraInicio = new Date(`${formData.data}T${formData.hora}:00`).toISOString()

    await $fetch('/api/agendamentos', {
      method: 'POST',
      body: {
        pacienteId: formData.pacienteId,
        dentistaId: formData.dentistaId,
        dataHoraInicio,
        procedimento: formData.procedimento,
        observacoes: formData.observacoes || null,
      },
    })

    toast.success('Consulta agendada com sucesso!')
    emit('success')
    closeModal()
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((err: z.ZodIssue) => { if (err.path[0]) errors.value[String(err.path[0])] = err.message })
    } else {
      toast.error('Erro ao agendar consulta. Tente novamente.')
      console.error('Erro ao criar agendamento:', error)
    }
  } finally {
    isLoading.value = false
  }
}
</script>
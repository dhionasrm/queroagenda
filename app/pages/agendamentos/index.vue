<template>
  <div class="p-8 space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Agenda</h1>
        <p class="text-gray-500 mt-1">Gerencie os horários e consultas da clínica.</p>
      </div>
      
      <button 
        @click="isModalOpen = true"
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <Calendar class="w-4 h-4" />
        Novo Agendamento
      </button>
    </div>

    <div class="flex gap-2 border-b border-gray-200">
      <button
        @click="abaAtiva = 'proximos'"
        :class="abaAtiva === 'proximos' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500 hover:text-gray-700'"
        class="px-4 py-2 text-sm font-medium"
      >Próximos</button>
      <button
        @click="abaAtiva = 'hoje'"
        :class="abaAtiva === 'hoje' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500 hover:text-gray-700'"
        class="px-4 py-2 text-sm font-medium"
      >Hoje</button>
      <button
        @click="abaAtiva = 'historico'"
        :class="abaAtiva === 'historico' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500 hover:text-gray-700'"
        class="px-4 py-2 text-sm font-medium"
      >Histórico</button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-emerald-600" />
    </div>

    <div v-else class="space-y-3">
      <div v-if="appointments?.length === 0" class="text-center py-12 text-gray-500">
        Nenhuma consulta agendada.
      </div>

      <div v-for="apt in appointments" :key="apt.id" 
        @click="() => { selectedAppointmentId = apt.id; isDetalheModalOpen = true }"
        class="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer">
        
        <div class="flex items-center gap-4 flex-1">
          <div class="bg-gray-50 rounded-lg p-2 text-center min-w-[70px]">
            <span class="block text-xs font-bold text-emerald-600 uppercase">{{ obterMes(apt.dataHoraInicio) }}</span>
            <span class="block text-xl font-bold text-gray-900">{{ obterDia(apt.dataHoraInicio) }}</span>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 hover:text-emerald-600 transition-colors">{{ apt.paciente?.nome || 'Paciente excluído' }}</h3>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-sm text-gray-500 flex items-center gap-1">
                <Clock class="w-3 h-3" /> {{ obterHora(apt.dataHoraInicio) }}
              </span>
              <span class="text-sm text-gray-500 flex items-center gap-1">
                <User class="w-3 h-3" /> Dr(a). {{ apt.dentista?.nome || 'Dentista excluído' }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span class="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
            {{ apt.procedimento || 'Consulta Padrão' }}
          </span>
          <button
            @click="excluirAgendamento(apt.id)"
            :disabled="excluindo === apt.id"
            class="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Loader2 v-if="excluindo === apt.id" class="w-4 h-4 animate-spin" />
            <Trash2 v-else class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <UiNovoAgendamento 
      v-if="isModalOpen"
      :isOpen="isModalOpen"
      @update:isOpen="isModalOpen = $event"
      @success="fetchAppointments" 
    />

    <UiDetalheAgendamento 
      :isOpen="isDetalheModalOpen"
      :appointmentId="selectedAppointmentId || undefined"
      @update:isOpen="isDetalheModalOpen = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Clock, User, Trash2, Loader2 } from 'lucide-vue-next'

const isModalOpen = ref(false)
const isDetalheModalOpen = ref(false)
const selectedAppointmentId = ref<number | null>(null)
const excluindo = ref<number | null>(null)
const abaAtiva = ref<'proximos' | 'hoje' | 'historico'>('proximos')

// query: { filtro: abaAtiva } — o useFetch re-busca automaticamente quando abaAtiva muda
const { data: appointments, pending: isLoading, refresh: fetchAppointments } = await useFetch('/api/agendamentos', {
  query: { filtro: abaAtiva },
})

const excluirAgendamento = async (id: number) => {
  if (!confirm('Deseja realmente excluir este agendamento?')) return
  excluindo.value = id
  try {
    await $fetch(`/api/agendamentos/${id}`, { method: 'DELETE' as 'GET' })
    await fetchAppointments()
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error)
    alert('Não foi possível excluir o agendamento.')
  } finally {
    excluindo.value = null
  }
}

// Funções utilitárias para formatar a data que vem do banco (ISO 8601)
const obterMes = (dataIso: string) => {
  if (!dataIso) return ''
  // Retorna "out", "nov", "dez", etc.
  return new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(dataIso)).replace('.', '')
}

const obterDia = (dataIso: string) => {
  if (!dataIso) return ''
  // Retorna "01", "15", "30", etc.
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(new Date(dataIso))
}

const obterHora = (dataIso: string) => {
  if (!dataIso) return ''
  // Retorna "14:30", "09:00", etc.
  return new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(new Date(dataIso))
}
</script>
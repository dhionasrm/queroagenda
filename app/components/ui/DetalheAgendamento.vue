<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
      
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Detalhes da Consulta</h2>
          <p class="text-sm text-gray-500 mt-1">Informações do agendamento e do paciente</p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div v-if="isLoading" class="p-6 flex justify-center">
        <Loader2 class="w-6 h-6 animate-spin text-emerald-600" />
      </div>

      <div v-else class="p-6 overflow-y-auto space-y-6">
        
        <!-- Informações da Consulta -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Informações da Consulta</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase">Data</label>
              <p class="text-sm font-medium text-gray-900 mt-1">{{ formatarData(appointment?.dataHoraInicio) }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase">Horário</label>
              <p class="text-sm font-medium text-gray-900 mt-1">{{ formatarHora(appointment?.dataHoraInicio) }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase">Dentista</label>
              <p class="text-sm font-medium text-gray-900 mt-1">Dr(a). {{ appointment?.dentista?.nome || 'Não informado' }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase">Procedimento</label>
              <p class="text-sm font-medium text-gray-900 mt-1">{{ appointment?.procedimento || 'Não informado' }}</p>
            </div>
          </div>
          <div v-if="appointment?.observacoes" class="mt-4">
            <label class="text-xs font-medium text-gray-500 uppercase">Observações</label>
            <p class="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">{{ appointment.observacoes }}</p>
          </div>
        </div>

        <div class="border-t border-gray-200"></div>

        <!-- Informações do Paciente -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Dados do Paciente</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="text-xs font-medium text-gray-500 uppercase">Nome Completo</label>
              <p class="text-sm font-medium text-gray-900 mt-1">{{ appointment?.paciente?.nome || 'Não informado' }}</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase">Telefone</label>
                <p class="text-sm font-medium text-gray-900 mt-1 flex items-center gap-2">
                  <Phone class="w-4 h-4" />
                  {{ appointment?.paciente?.telefone || 'Não informado' }}
                </p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase">Email</label>
                <p class="text-sm font-medium text-gray-900 mt-1 flex items-center gap-2">
                  <Mail class="w-4 h-4" />
                  {{ appointment?.paciente?.email || 'Não informado' }}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase">CPF</label>
                <p class="text-sm font-medium text-gray-900 mt-1">{{ appointment?.paciente?.cpf || 'Não informado' }}</p>
              </div>
              <div>
                <label class="text-xs font-medium text-gray-500 uppercase">Data de Nascimento</label>
                <p class="text-sm font-medium text-gray-900 mt-1">{{ formatarDataNascimento(appointment?.paciente?.dataNascimento) }}</p>
              </div>
            </div>
            <div v-if="appointment?.paciente?.tipoAtendimento">
              <label class="text-xs font-medium text-gray-500 uppercase">Tipo de Atendimento</label>
              <p class="text-sm font-medium text-gray-900 mt-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full w-fit">{{ appointment.paciente.tipoAtendimento }}</p>
            </div>
            <div v-if="appointment?.paciente?.observacoes">
              <label class="text-xs font-medium text-gray-500 uppercase">Observações do Paciente</label>
              <p class="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">{{ appointment.paciente.observacoes }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end">
        <button 
          @click="closeModal"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Loader2, Phone, Mail } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  appointmentId?: number | string
}>()

const emit = defineEmits(['update:isOpen'])

const appointment = ref<any>(null)
const isLoading = ref(false)

const closeModal = () => {
  emit('update:isOpen', false)
}

const fetchAppointmentDetails = async () => {
  if (!props.appointmentId) return
  
  isLoading.value = true
  try {
    const response = await $fetch(`/api/agendamentos/${props.appointmentId}`)
    appointment.value = response
  } catch (error) {
    console.error('Erro ao carregar detalhes do agendamento:', error)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchAppointmentDetails()
  }
})

const formatarData = (dataIso: string) => {
  if (!dataIso) return 'Não informado'
  return new Intl.DateTimeFormat('pt-BR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(new Date(dataIso))
}

const formatarHora = (dataIso: string) => {
  if (!dataIso) return 'Não informado'
  return new Intl.DateTimeFormat('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }).format(new Date(dataIso))
}

const formatarDataNascimento = (data: string) => {
  if (!data) return 'Não informado'
  return new Intl.DateTimeFormat('pt-BR', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).format(new Date(data))
}
</script>

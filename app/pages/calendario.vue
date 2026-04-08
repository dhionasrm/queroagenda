<template>
  <div class="p-8 space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Calendário</h1>
      <p class="text-gray-500 mt-1">Visualize todas as consultas do mês</p>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center justify-between pb-4">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ monthNames[currentDate.getMonth()] }} {{ currentDate.getFullYear() }}
        </h2>
        <div class="flex gap-2">
          <button 
            @click="previousMonth" 
            :disabled="isLoading"
            class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft class="w-5 h-5 text-gray-600" />
          </button>
          <button 
            @click="nextMonth" 
            :disabled="isLoading"
            class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <ChevronRight class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div class="p-6">
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <Loader2 class="h-8 w-8 animate-spin text-emerald-600" />
        </div>
        
        <div v-else class="grid grid-cols-7 gap-3">
          
          <div 
            v-for="day in dayNames" 
            :key="day" 
            class="pb-2 text-center text-sm font-medium text-gray-500"
          >
            {{ day }}
          </div>

          <div 
            v-for="n in firstDayOfMonth" 
            :key="`empty-${n}`" 
            class="min-h-[100px]"
          ></div>

          <div 
            v-for="day in daysInMonth" 
            :key="day"
            @click="handleDayClick(day)"
            :class="[
              'min-h-[100px] p-3 rounded-xl border transition-all duration-200 flex flex-col gap-1',
              appointments[day] ? 'cursor-pointer hover:border-emerald-300 hover:shadow-sm' : 'cursor-default',
              isToday(day) ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-gray-100'
            ]"
          >
            <span :class="['text-sm font-medium', isToday(day) ? 'text-emerald-700' : 'text-gray-700']">
              {{ day }}
            </span>
            
            <div v-if="appointments[day]" class="mt-auto">
              <span class="block px-2 py-1 text-xs font-medium rounded-md bg-emerald-100 text-emerald-700 truncate text-left">
                {{ appointments[day] }} {{ appointments[day] === 1 ? 'consulta' : 'consultas' }}
              </span>
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <div v-if="selectedDay !== null" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <div class="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              Consultas de {{ selectedDay }} de {{ monthNames[currentDate.getMonth()] }}
            </h3>
          </div>
          <button @click="selectedDay = null" class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto">
          <div v-if="isLoadingDay" class="flex items-center justify-center py-12">
            <Loader2 class="h-8 w-8 animate-spin text-emerald-600" />
          </div>
          
          <div v-else-if="dayAppointments.length === 0" class="text-center py-8 text-gray-500">
            Nenhuma consulta encontrada para este dia.
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="apt in dayAppointments" 
              :key="apt.id" 
              class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Clock class="h-4 w-4 text-gray-400" />
                    <span class="font-medium text-gray-900">
                      {{ formatTime(apt.dataHoraInicio || apt.date) }}
                    </span>
                  </div>
                  <span :class="['text-xs px-2 py-1 rounded font-medium', getStatusInfo(apt.status).className]">
                    {{ getStatusInfo(apt.status).label }}
                  </span>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <User class="h-4 w-4 text-gray-400" />
                    <span class="text-sm text-gray-700">
                      <span class="font-medium text-gray-900">Paciente:</span> {{ apt.patient_name || apt.nomePaciente || 'N/A' }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2">
                    <UserCog class="h-4 w-4 text-gray-400" />
                    <span class="text-sm text-gray-700">
                      <span class="font-medium text-gray-900">Dentista:</span> {{ apt.dentist_name || apt.nomeDentista || 'N/A' }}
                    </span>
                  </div>

                  <div v-if="apt.treatment_type" class="text-sm text-gray-700">
                    <span class="font-medium text-gray-900">Tratamento:</span> {{ apt.treatment_type }}
                  </div>

                  <div v-if="apt.notes" class="text-sm text-gray-500">
                    <span class="font-medium text-gray-900">Observações:</span> {{ apt.notes }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ChevronLeft, ChevronRight, Loader2, Clock, User, UserCog, X } from 'lucide-vue-next'

// Estado Principal
const currentDate = ref(new Date())
const appointments = ref<Record<number, number>>({})
const isLoading = ref(false)

// Estado do Modal (Dia selecionado)
const selectedDay = ref<number | null>(null)
const dayAppointments = ref<any[]>([])
const isLoadingDay = ref(false)

// Constantes
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]
const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Propriedades Computadas
const daysInMonth = computed(() => {
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).getDay()
})

const isToday = (day: number) => {
  const today = new Date()
  return day === today.getDate() &&
         currentDate.value.getMonth() === today.getMonth() &&
         currentDate.value.getFullYear() === today.getFullYear()
}

// Navegação
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

watch(currentDate, () => {
  loadMonthlyAppointments()
})

// Funções Helpers
const formatTime = (dateString: string | undefined) => {
  if (!dateString) return '--:--'
  return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    agendada:     { label: 'Agendada',        className: 'bg-blue-100 text-blue-800' },
    confirmada:   { label: 'Confirmada',      className: 'bg-emerald-100 text-emerald-800' },
    aguardando:   { label: 'Aguardando',      className: 'bg-yellow-100 text-yellow-800' },
    em_andamento: { label: 'Em Andamento',    className: 'bg-purple-100 text-purple-800' },
    concluida:    { label: 'Concluída',       className: 'bg-gray-100 text-gray-800' },
    cancelada:    { label: 'Cancelada',       className: 'bg-red-100 text-red-800' },
    falta:        { label: 'Não Compareceu',  className: 'bg-orange-100 text-orange-800' },
    reagendada:   { label: 'Reagendada',      className: 'bg-yellow-100 text-yellow-800' },
  }
  return statusMap[status] || { label: status || 'Desconhecido', className: 'bg-gray-100 text-gray-800' }
}

// Mocks
const loadMonthlyAppointments = async () => {
  isLoading.value = true
  try {
    await new Promise(r => setTimeout(r, 600)) 
    appointments.value = {
      5: 2,
      12: 1,
      15: 4,
      22: 3,
      [new Date().getDate()]: 2 
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const handleDayClick = async (day: number) => {
  if (!appointments.value[day]) return
  
  selectedDay.value = day
  isLoadingDay.value = true
  
  try {
    await new Promise(r => setTimeout(r, 600)) 
    dayAppointments.value = [
      {
        id: '1',
        dataHoraInicio: new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day, 14, 30).toISOString(),
        status: 'agendada',
        patient_name: 'João da Silva',
        dentist_name: 'Dra. Ana Paula',
        treatment_type: 'Limpeza de rotina'
      }
    ]
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingDay.value = false
  }
}

onMounted(() => {
  loadMonthlyAppointments()
})
</script>
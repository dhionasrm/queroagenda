<template>
  <div class="p-8 space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-500 mt-1">Bem-vindo de volta! Aqui está o resumo de hoje.</p>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
      <h3 class="font-bold">Ops! Erro ao carregar os dados.</h3>
      <p class="text-sm mt-1">{{ error.message || error }}</p>
    </div>

    <div v-else-if="pending" class="flex justify-center py-12">
      <span class="text-gray-500">Carregando métricas...</span>
    </div>

    <div v-else-if="dashboardData">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span class="text-sm font-medium text-gray-500">Consultas Hoje</span>
            <div class="bg-emerald-50 p-2 rounded-lg text-emerald-600">
              <Calendar class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-3xl font-bold text-gray-900">{{ dashboardData.cards?.consultasHoje || 0 }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ dashboardData.cards?.consultasProximos7Dias || 0 }} próximos 7 dias</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span class="text-sm font-medium text-gray-500">Pacientes Ativos</span>
            <div class="bg-blue-50 p-2 rounded-lg text-blue-600">
              <Users class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-3xl font-bold text-gray-900">{{ dashboardData.cards?.pacientesAtivos || 0 }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ dashboardData.cards?.pacientesTotal || 0 }} cadastrados</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span class="text-sm font-medium text-gray-500">Concluídas Hoje</span>
            <div class="bg-orange-50 p-2 rounded-lg text-orange-600">
              <Clock class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-3xl font-bold text-gray-900">{{ dashboardData.cards?.consultasConcluidasHoje || 0 }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ dashboardData.cards?.consultasAguardando || 0 }} aguardando atendimento</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <span class="text-sm font-medium text-gray-500">Dentistas Ativos</span>
            <div class="bg-teal-50 p-2 rounded-lg text-teal-600">
              <User class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-3xl font-bold text-gray-900">{{ dashboardData.cards?.dentistasAtivos || 0 }}</h3>
            <p class="text-xs text-gray-500 mt-1">Total ativo</p>
          </div>
        </div>

      </div>

      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">Consultas de Hoje</h2>
        </div>
        
        <div class="p-6">
          <div v-if="!dashboardData.listaHoje || dashboardData.listaHoje.length === 0" class="text-center py-8 text-gray-500">
            Nenhuma consulta para hoje
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="consulta in dashboardData.listaHoje" :key="consulta.id" class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg font-bold text-sm text-center min-w-[70px]">
                  {{ formatarHora(consulta.dataHoraInicio) }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ consulta.paciente?.nome || 'Paciente não encontrado' }}</p>
                  <p class="text-sm text-gray-500">Dr(a). {{ consulta.dentista?.nome }} • {{ consulta.procedimento || 'Geral' }}</p>
                </div>
              </div>
              <div>
                 <span class="px-3 py-1 rounded-full text-xs font-medium uppercase" :class="obterClasseStatus(consulta.status)">
                  {{ consulta.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Trocamos o UserCheck pelo User aqui e no HTML (linha 69)!
import { Calendar, Users, Clock, User } from 'lucide-vue-next'
import { watchEffect } from 'vue'

const { data: dashboardData, pending, error } = await useFetch('/api/dashboard')

// Só pra gente garantir que se der erro, vai aparecer no console
watchEffect(() => {
  if (error.value) console.error("Erro na busca do Nuxt:", error.value)
})

const formatarHora = (dataIso: string) => {
  if (!dataIso) return '--:--'
  return new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(new Date(dataIso))
}

const obterClasseStatus = (status: string) => {
  const statusColors: Record<string, string> = {
    'agendada': 'bg-blue-50 text-blue-700',
    'aguardando': 'bg-orange-50 text-orange-700',
    'em_andamento': 'bg-purple-50 text-purple-700',
    'concluida': 'bg-emerald-50 text-emerald-700',
    'cancelada': 'bg-red-50 text-red-700',
    'falta': 'bg-gray-100 text-gray-700'
  }
  return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700'
}
</script>
<template>
  <div class="p-8 space-y-6 animate-fade-in max-w-5xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Bell class="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Notificações</h1>
          <p class="text-gray-500 mt-1">
            Você tem <strong class="text-emerald-600">{{ unreadCount }}</strong> notificações não lidas
          </p>
        </div>
      </div>
      
      <button 
        v-if="unreadCount > 0"
        @click="markAllAsRead"
        class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <CheckCheck class="w-4 h-4" />
        Marcar todas como lidas
      </button>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-emerald-600" />
    </div>

    <div v-else-if="notifications.length === 0" class="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <BellOff class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900">Nenhuma notificação</h3>
      <p class="text-gray-500 mt-1">Você está em dia com todos os seus avisos.</p>
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="relative flex items-start gap-4 p-5 rounded-xl border transition-all hover:shadow-md group"
        :class="[
          notification.isRead 
            ? 'bg-white border-gray-200' 
            : 'bg-emerald-50/50 border-emerald-100'
        ]"
      >
        <div 
          v-if="!notification.isRead"
          class="absolute top-5 left-3 w-2 h-2 rounded-full bg-emerald-500"
        ></div>

        <div 
          class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 ml-2"
          :class="getIconConfig(notification.type).bg"
        >
          <component 
            :is="getIconConfig(notification.type).icon" 
            class="w-5 h-5"
            :class="getIconConfig(notification.type).color"
          />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 
                class="text-base font-semibold"
                :class="notification.isRead ? 'text-gray-900' : 'text-emerald-900'"
              >
                {{ notification.title }}
              </h3>
              <p class="text-sm text-gray-600 mt-1 pr-4">
                {{ notification.message }}
              </p>
            </div>
            
            <span class="text-xs font-medium whitespace-nowrap" :class="notification.isRead ? 'text-gray-400' : 'text-emerald-600'">
              {{ notification.timeAgo }}
            </span>
          </div>

          <div class="mt-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 sm:opacity-0 opacity-100">
            <button 
              v-if="!notification.isRead"
              @click="markAsRead(notification.id)"
              class="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-100/50 px-2 py-1 rounded"
            >
              <Check class="w-3 h-3" />
              Marcar como lida
            </button>
            <button 
              @click="deleteNotification(notification.id)"
              class="text-xs font-medium text-gray-500 hover:text-red-600 flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition-colors"
            >
              <Trash2 class="w-3 h-3" />
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Bell, 
  BellOff, 
  CheckCheck, 
  Check, 
  Trash2, 
  Loader2, 
  Calendar, 
  AlertTriangle, 
  Info,
  Settings
} from 'lucide-vue-next'

// Tipagem
type NotificationType = 'appointment' | 'alert' | 'system' | 'info'

interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  timeAgo: string
  createdAt: string
}

// Estados
const notifications = ref<Notification[]>([])
const isLoading = ref(true)

// Computados
const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)

// Helper para definir as cores e ícones baseados no tipo
const getIconConfig = (type: NotificationType) => {
  switch (type) {
    case 'appointment':
      return { icon: Calendar, bg: 'bg-blue-100', color: 'text-blue-600' }
    case 'alert':
      return { icon: AlertTriangle, bg: 'bg-amber-100', color: 'text-amber-600' }
    case 'system':
      return { icon: Settings, bg: 'bg-gray-100', color: 'text-gray-600' }
    default:
      return { icon: Info, bg: 'bg-emerald-100', color: 'text-emerald-600' }
  }
}

// Carregar Dados (Mock simulando API)
const loadNotifications = async () => {
  isLoading.value = true
  try {
    // ⚠️ AQUI ENTRA SUA CHAMADA NUXT (ex: $fetch('/api/notifications'))
    await new Promise(r => setTimeout(r, 600)) // Fake delay

    notifications.value = [
      {
        id: '1',
        title: 'Nova consulta agendada',
        message: 'O paciente João da Silva agendou uma avaliação para amanhã às 14:00.',
        type: 'appointment',
        isRead: false,
        timeAgo: 'Há 5 min',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Estoque baixo',
        message: 'O item "Resina Composta" está com o estoque abaixo do mínimo recomendado (Restam 2 unidades).',
        type: 'alert',
        isRead: false,
        timeAgo: 'Há 2 horas',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Atualização do Sistema',
        message: 'O sistema passará por uma manutenção programada nesta sexta-feira às 23:00.',
        type: 'system',
        isRead: true,
        timeAgo: 'Ontem',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Retorno de paciente',
        message: 'A paciente Maria Fernandes completou 6 meses desde a última limpeza. É hora de enviar um lembrete.',
        type: 'info',
        isRead: true,
        timeAgo: 'Há 2 dias',
        createdAt: new Date().toISOString()
      }
    ]
  } catch (error) {
    console.error('Erro ao carregar notificações:', error)
  } finally {
    isLoading.value = false
  }
}

// Ações
const markAsRead = async (id: string) => {
  const notif = notifications.value.find(n => n.id === id)
  if (notif) {
    notif.isRead = true
    // ⚠️ Chamar API para salvar o status de leitura
  }
}

const markAllAsRead = async () => {
  notifications.value.forEach(n => {
    n.isRead = true
  })
  // ⚠️ Chamar API para marcar todas como lidas
}

const deleteNotification = async (id: string) => {
  // Animação/UX: Remove imediatamente da tela, depois chama API
  notifications.value = notifications.value.filter(n => n.id !== id)
  // ⚠️ Chamar API para deletar
}

// Lifecycle
onMounted(() => {
  loadNotifications()
})
</script>
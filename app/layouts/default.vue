<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    
    <aside class="w-64 flex flex-col bg-white border-r border-gray-200">
      
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-center">
          <img src="/logo_login.png" alt="MedAgenda" class="w-full h-auto max-w-[200px] object-contain" />
        </div>
      </div>

      <nav class="flex-1 p-4 overflow-y-auto space-y-1">
        <NuxtLink 
          v-for="item in menuItems" 
          :key="item.title"
          :to="item.url"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          active-class="bg-emerald-50 text-emerald-700 font-medium"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span>{{ item.title }}</span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
            <span class="text-sm font-medium text-emerald-700">
              {{ userName.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
            <p class="text-xs text-gray-500">{{ userProfile }}</p>
          </div>
        </div>

        <div class="mb-3">
          <NuxtLink 
            to="/configuracoes"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            active-class="bg-emerald-50 text-emerald-700 font-medium"
          >
            <Settings class="w-5 h-5" />
            <span>Configurações</span>
          </NuxtLink>
        </div>

        <button 
          @click="handleLogout"
          class="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <LogOut class="w-4 h-4" />
          Sair
        </button>
      </div>

    </aside>

    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Calendar, 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Settings, 
  LogOut, 
  LifeBuoy, 
  Bell 
} from 'lucide-vue-next'

// Dados mocados temporariamente (depois ligaremos com o login real)
const userName = ref('Dr. Admin')
const userProfile = ref('Administrador')

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard }, // Ajustei o URL para a raiz
  { title: 'Agendamentos', url: '/agendamentos', icon: CalendarDays },
  { title: 'Calendário', url: '/calendario', icon: Calendar },
  { title: 'Dentistas', url: '/doutores', icon: Users },
  { title: 'Pacientes', url: '/pacientes', icon: Users },
  { title: 'Notificações', url: '/notificacoes', icon: Bell },
  { title: 'Suporte', url: '/suporte', icon: LifeBuoy },
]

const handleLogout = async () => {
  // Por enquanto, apenas redireciona para o login
  await navigateTo('/login')
}
</script>

<style scoped>
/* Um pequeno ajuste para esconder a barra de rolagem e ficar mais limpo */
nav::-webkit-scrollbar {
  display: none;
}
</style>
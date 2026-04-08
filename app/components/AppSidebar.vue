<template>
  <aside class="border-r border-gray-200 h-screen flex flex-col bg-white">
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-center">
        <img src="/logo_login.png" alt="MedAgenda" class="w-full h-auto max-w-[200px] object-contain" />
      </div>
    </div>

    <div class="p-2 flex-1 overflow-y-auto">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.title">
          <NuxtLink
            :to="item.url"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            activeClass="bg-gray-100 text-emerald-600 font-medium"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.title }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="p-4 border-t border-gray-200">
      
      <div class="flex items-center gap-3 mb-3">
        <div class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
          <span class="text-sm font-medium text-emerald-700">U</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">Usuário</p>
          <p class="text-xs text-gray-500">Administrador</p>
        </div>
      </div>

      <div class="mb-3">
        <NuxtLink
          to="/configuracoes"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          activeClass="bg-gray-100 text-emerald-600 font-medium"
        >
          <Settings class="w-5 h-5" />
          <span>Configurações</span>
        </NuxtLink>
      </div>

      <button
        @click="handleLogout"
        class="w-full flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut class="w-4 h-4" />
        Sair
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
// 1. Importamos os ícones da versão para Vue
import { Calendar, LayoutDashboard, Users, CalendarDays, Settings, LogOut, LifeBuoy, Bell } from 'lucide-vue-next'

// 2. Definimos os itens do menu
const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Agendamentos', url: '/agendamentos', icon: CalendarDays },
  { title: 'Calendário', url: '/calendario', icon: Calendar },
  { title: 'Dentistas', url: '/doutores', icon: Users },
  { title: 'Pacientes', url: '/pacientes', icon: Users },
  { title: 'Notificações', url: '/notificacoes', icon: Bell },
  { title: 'Suporte', url: '/suporte', icon: LifeBuoy },
]

// 3. Função de logout com a navegação do Nuxt
const handleLogout = async () => {
  // Quando você tiver o state de usuário configurado no Nuxt, chame o logout aqui.
  // const { logout } = useAuth()
  // logout()

  // Navega de volta para a tela de login usando a função nativa do Nuxt
  await navigateTo('/')
}
</script>
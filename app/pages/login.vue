<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
    
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-50" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-50" />
    </div>

    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl relative z-10 p-8">
      
      <div class="text-center pb-6">
        <img src="/logo_login.png" alt="Quero Agenda" class="h-32 mx-auto object-contain" />
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        
        <div class="space-y-2">
          <label for="username" class="text-sm font-medium text-gray-700">Email</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </span>
            <input
              id="username"
              type="email"
              placeholder="Digite seu email"
              v-model="username"
              class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b8b76] focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div class="space-y-2">
          <label for="password" class="text-sm font-medium text-gray-700">Senha</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              v-model="password"
              class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b8b76] focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-[#2b8b76] text-white py-2.5 rounded-lg hover:bg-[#227261] transition-colors font-medium mt-2 shadow-md"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>

      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Esqueceu sua senha? <a href="/reset-password" class="text-[#2b8b76] hover:underline font-medium">Redefinir senha</a>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: false })

const username = ref('')
const password = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    const { data, error } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })

    if (error.value) {
      alert(error.value.statusMessage || 'Usuário ou senha incorretos')
      return
    }

    if (data.value?.success) {
      await navigateTo('/')
    }

  } catch (error) {
    alert('Erro ao se comunicar com o servidor.')
  } finally {
    isLoading.value = false
  }
}
</script>
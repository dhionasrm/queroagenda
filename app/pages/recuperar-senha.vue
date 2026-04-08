<template>
  <div class="min-h-screen flex items-center justify-center bg-emerald-50/30 p-4 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
    </div>

    <div class="bg-white w-full max-w-md rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 relative z-10 animate-fade-in">
      
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Recuperar senha</h1>
        <p class="text-sm text-gray-500 mt-2">Enviaremos um link para o seu email</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="Digite seu email"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          {{ isLoading ? 'Enviando...' : 'Enviar instruções' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Lembrou a senha? 
        <NuxtLink to="/" class="text-emerald-600 font-medium hover:underline transition-colors">
          Voltar ao login
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'nuxt/app'
import { Loader2 } from 'lucide-vue-next'

const email = ref('')
const isLoading = ref(false)
const router = useRouter()

// Função de validação isolada (para não depender de libs externas)
const isEmailValid = (val: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(val)
}

const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    if (!isEmailValid(email.value)) {
      // ⚠️ Adicione seu Toast de erro aqui (ex: vue-sonner)
      console.warn('Informe um email válido.')
      isLoading.value = false
      return
    }

    // ⚠️ AQUI ENTRA SUA CHAMADA NUXT (ex: authService.forgotPassword)
    await new Promise(r => setTimeout(r, 1200)) // Fake delay simulando API
    
    // ⚠️ Adicione seu Toast de sucesso aqui
    console.log('Enviamos as instruções para seu email.')
    
    router.push('/')
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error)
    // ⚠️ Adicione seu Toast de erro aqui
  } finally {
    isLoading.value = false
  }
}

// Configuração opcional para remover layout padrão (caso você tenha uma navbar/sidebar global)
definePageMeta({
  layout: false 
})
</script>
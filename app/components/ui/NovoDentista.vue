<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-0">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
      
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Novo Dentista</h2>
          <p class="text-sm text-gray-500 mt-1">Preencha os dados do dentista</p>
        </div>
        <button 
          @click="closeModal" 
          class="text-gray-400 hover:bg-gray-100 hover:text-gray-700 p-2 rounded-full transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <form id="dentistForm" @submit.prevent="handleSubmit" class="grid gap-4">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
              <input 
                v-model="formData.nome" 
                type="text" 
                placeholder="Nome completo do dentista" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
              <p v-if="errors.nome" class="text-xs text-red-500 mt-1">{{ errors.nome }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">CRO *</label>
              <input 
                v-model="formData.cro" 
                type="text" 
                placeholder="Número do CRO" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
              <p v-if="errors.cro" class="text-xs text-red-500 mt-1">{{ errors.cro }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
            <input 
              v-model="formData.especialidade" 
              type="text" 
              placeholder="Ex: Ortodontia, Implantodontia, etc" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
            />
            <p v-if="errors.especialidade" class="text-xs text-red-500 mt-1">{{ errors.especialidade }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
              <input 
                :value="formData.telefone" 
                @input="handlePhoneInput" 
                type="text" 
                placeholder="(00) 00000-0000" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
              <p v-if="errors.telefone" class="text-xs text-red-500 mt-1">{{ errors.telefone }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                v-model="formData.email" 
                type="email" 
                placeholder="email@exemplo.com" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
              />
              <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
            </div>
          </div>

        </form>
      </div>

      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
        <button 
          @click="closeModal" 
          type="button" 
          :disabled="isLoading" 
          class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
        >
          Cancelar
        </button>
        <button 
          form="dentistForm" 
          type="submit" 
          :disabled="isLoading" 
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          {{ isLoading ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { X, Loader2 } from 'lucide-vue-next'
import { dentistSchema } from '@/schemas/forms'
import { dentistService } from '@/services/dentistService'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'success'): void
}>()

const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

const formData = reactive({
  nome: '',
  cro: '',
  especialidade: '',
  telefone: '',
  email: '',
})

const reset = () => {
  formData.nome = ''
  formData.cro = ''
  formData.especialidade = ''
  formData.telefone = ''
  formData.email = ''
  errors.value = {}
}

const closeModal = () => {
  emit('update:isOpen', false)
  reset()
}

const handlePhoneInput = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  if (value.length > 11) value = value.slice(0, 11)

  if (value.length > 2) {
    value = `(${value.slice(0, 2)}) ${value.slice(2)}`
  }
  if (value.length > 10) {
    value = `${value.slice(0, 10)}-${value.slice(10)}`
  }
  formData.telefone = value
}

const handleSubmit = async () => {
  errors.value = {}
  try {
    dentistSchema.parse(formData)
    isLoading.value = true
    
    // CHAMADA REAL PARA O BANCO DE DADOS
    await $fetch('/api/dentistas', {
      method: 'POST',
      body: formData
    })
    
    toast.success("Dentista cadastrado com sucesso!")
    emit('success')
    closeModal()
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        if (err.path[0]) errors.value[err.path[0]] = err.message
      })
    } else {
      toast.error("Erro ao salvar no banco de dados.")
    }
  } finally {
    isLoading.value = false
  }
}
</script>
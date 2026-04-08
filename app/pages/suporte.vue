<template>
  <div class="p-8 space-y-6 animate-fade-in">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
        <LifeBuoy class="w-6 h-6 text-emerald-600" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Suporte</h1>
        <p class="text-gray-500">Abra um chamado para nossa equipe de suporte</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900">Abrir novo chamado</h2>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="grid gap-4">
          <input 
            v-model="subject" 
            type="text" 
            placeholder="Assunto" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
          
          <textarea 
            v-model="description" 
            placeholder="Descreva o problema ou solicitação" 
            rows="6" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-y"
          ></textarea>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <select 
                v-model="priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white appearance-none"
              >
                <option value="Baixa">Baixa</option>
                <option value="Normal">Normal</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div>
              <input 
                v-model="email" 
                type="email" 
                placeholder="E-mail para contato (opcional)" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
              <p v-if="email && !isEmailValid(email)" class="text-xs text-amber-600 mt-1">
                Informe um endereço de email válido (ex.: usuário@dominio).
              </p>
            </div>

            <div>
              <input 
                :value="phone" 
                @input="handlePhoneInput"
                type="text" 
                placeholder="Telefone para contato (opcional)" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button 
              type="submit"
              class="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              Abrir chamado
            </button>
          </div>
        </form>

        <div class="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
          <button 
            @click="handleCall" 
            class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Phone class="w-4 h-4" />
            Ligar
          </button>

          <button 
            @click="handleWhatsApp" 
            class="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-medium transition-colors"
          >
            <MessageSquare class="w-4 h-4" />
            Atendimento no WhatsApp
          </button>
        </div>
      </div>
    </div>

    <div v-if="tickets.length > 0" class="grid gap-4 mt-8">
      <div 
        v-for="t in tickets" 
        :key="t.id" 
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md"
      >
        <div class="flex sm:items-center sm:justify-between flex-col sm:flex-row gap-2 mb-3">
          <div>
            <h3 class="font-semibold text-gray-900">{{ t.subject }}</h3>
            <p class="text-xs text-gray-500 mt-0.5">
              #{{ t.id }} &bull; {{ t.createdAt }} &bull; Prioridade: 
              <span :class="{
                'text-red-600 font-medium': t.priority === 'Alta',
                'text-amber-600 font-medium': t.priority === 'Normal',
                'text-emerald-600 font-medium': t.priority === 'Baixa'
              }">
                {{ t.priority }}
              </span>
            </p>
          </div>
        </div>
        <p class="text-sm text-gray-700 whitespace-pre-line">{{ t.description }}</p>
        <div class="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-500 flex gap-2">
          <span class="font-medium">Contato:</span> 
          {{ t.contactEmail || '-' }} &bull; {{ t.contactPhone || '-' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LifeBuoy, Phone, MessageSquare } from 'lucide-vue-next'

// Tipagem
interface Ticket {
  id: number
  subject: string
  description: string
  priority: string
  contactEmail?: string
  contactPhone?: string
  createdAt: string
}

// Estados
const subject = ref("")
const description = ref("")
const priority = ref("Normal")
const email = ref("")
const phone = ref("")
const tickets = ref<Ticket[]>([])

// Utils Internos (Para evitar quebra se o @/lib/utils não existir no Nuxt)
const isEmailValid = (val: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(val)
}

const formatPhone = (val: string) => {
  let v = val.replace(/\D/g, '')
  if (v.length <= 10) {
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
    v = v.replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
    v = v.replace(/(\d{5})(\d)/, '$1-$2')
  }
  return v.substring(0, 15)
}

// Lógica
const handlePhoneInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  phone.value = formatPhone(target.value)
}

const handleSubmit = () => {
  if (!subject.value || !description.value) {
    // ⚠️ Adicione seu Toast de erro aqui (Ex: vue-sonner)
    console.warn("Preencha os campos obrigatórios")
    return
  }

  const newTicket: Ticket = {
    id: tickets.value.length + 1,
    subject: subject.value,
    description: description.value,
    priority: priority.value,
    contactEmail: email.value,
    contactPhone: phone.value,
    createdAt: new Date().toLocaleString('pt-BR'),
  }

  tickets.value.unshift(newTicket)
  
  // ⚠️ Adicione seu Toast de sucesso aqui
  console.log(`Chamado #${newTicket.id} criado com sucesso.`)
  
  // Limpar formulário
  subject.value = ""
  description.value = ""
  priority.value = "Normal"
  email.value = ""
  phone.value = ""
}

const handleWhatsApp = () => {
  const digits = phone.value.replace(/\D/g, '')
  if (!digits) {
    // ⚠️ Adicione seu Toast de erro aqui
    console.warn("Informe um telefone para chamar no WhatsApp.")
    return
  }
  const text = encodeURIComponent(subject.value || 'Olá, preciso de suporte')
  const url = `https://wa.me/${digits.startsWith('55') ? digits : '55' + digits}?text=${text}`
  window.open(url, '_blank')
}

const handleCall = () => {
  const digits = phone.value.replace(/\D/g, '')
  if (!digits) {
    // ⚠️ Adicione seu Toast de erro aqui
    console.warn("Informe um telefone para realizar a chamada.")
    return
  }
  window.location.href = `tel:${digits}`
}
</script>
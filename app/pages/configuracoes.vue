<template>
  <div class="p-8 space-y-6 animate-fade-in max-w-4xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Configurações</h1>
      <p class="text-gray-500">Gerencie as preferências do sistema</p>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center gap-3">
        <div class="p-2 rounded-lg bg-emerald-100">
          <Building class="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Informações da Clínica</h2>
          <p class="text-sm text-gray-500">Dados básicos do estabelecimento</p>
        </div>
      </div>
      <div class="p-6 space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Nome da Clínica</label>
            <input v-model="clinicName" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Telefone</label>
            <input :value="clinicPhone" @input="handlePhoneInput" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
          </div>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Endereço</label>
          <input v-model="clinicAddress" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center gap-3">
        <div class="p-2 rounded-lg bg-emerald-100">
          <Palette class="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Planos</h2>
          <p class="text-sm text-gray-500">Gerencie os tipos de atendimento</p>
        </div>
      </div>
      <div class="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p class="font-medium text-gray-900">Controle de planos</p>
          <p class="text-sm text-gray-500">Adicione ou remova planos usados no cadastro de pacientes</p>
        </div>
        <button @click="isPlanModalOpen = true" class="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
          Gerenciar planos
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center gap-3">
        <div class="p-2 rounded-lg bg-emerald-100">
          <Bell class="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Notificações</h2>
          <p class="text-sm text-gray-500">Configure alertas e lembretes</p>
        </div>
      </div>
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900">Lembrete de consulta</p>
            <p class="text-sm text-gray-500">Enviar SMS 24h antes</p>
          </div>
          <button @click="notifSMS = !notifSMS" :class="notifSMS ? 'bg-emerald-600' : 'bg-gray-200'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            <span :class="notifSMS ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
          </button>
        </div>
        <hr class="border-gray-100" />
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900">Email de confirmação</p>
            <p class="text-sm text-gray-500">Ao agendar nova consulta</p>
          </div>
          <button @click="notifEmail = !notifEmail" :class="notifEmail ? 'bg-emerald-600' : 'bg-gray-200'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            <span :class="notifEmail ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
          </button>
        </div>
        <hr class="border-gray-100" />
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900">Alertas do sistema</p>
            <p class="text-sm text-gray-500">Notificações importantes</p>
          </div>
          <button @click="notifSystem = !notifSystem" :class="notifSystem ? 'bg-emerald-600' : 'bg-gray-200'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            <span :class="notifSystem ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center gap-3">
        <div class="p-2 rounded-lg bg-emerald-100">
          <Shield class="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Segurança</h2>
          <p class="text-sm text-gray-500">Configurações de acesso e senha</p>
        </div>
      </div>
      <div class="p-6">
        <button @click="isPasswordModalOpen = true" class="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Alterar Senha
        </button>
      </div>
    </div>

    <div class="flex justify-end pt-2">
      <button class="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
        Salvar Alterações
      </button>
    </div>

    <div v-if="isPlanModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">Controle de planos</h2>
          <p class="text-sm text-gray-500">Adicione ou remova planos do sistema.</p>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex gap-2">
            <input v-model="newPlanName" @keyup.enter="addPlan" placeholder="Novo plano (ex: Plano C)" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            <button @click="addPlan" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Adicionar
            </button>
          </div>
          <div class="grid gap-2 max-h-60 overflow-y-auto pr-2">
            <div v-if="plans.length === 0" class="text-sm text-gray-500 text-center py-4">Nenhum plano cadastrado.</div>
            <div v-for="plan in plans" :key="plan" class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
              <span class="text-gray-700 font-medium">{{ plan }}</span>
              <button @click="removePlan(plan)" class="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors" title="Remover plano">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
          <button @click="isPlanModalOpen = false" class="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>

    <div v-if="isPasswordModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">Alterar Senha</h2>
          <p class="text-sm text-gray-500">Altere sua senha atual de forma segura.</p>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleChangePassword" class="space-y-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Senha atual</label>
              <input v-model="oldPassword" type="password" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Nova senha</label>
              <input v-model="newPassword" type="password" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Confirmar nova senha</label>
              <input v-model="confirmPassword" type="password" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div class="pt-2">
              <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full transition-all duration-300" :class="strengthColor" :style="{ width: strengthScore + '%' }"></div>
              </div>
              <div class="flex items-center justify-between text-xs mt-2 text-gray-500">
                <span>Nível: <strong :class="strengthTextClass">{{ strengthScore >= 80 ? 'Forte' : strengthScore >= 50 ? 'Média' : 'Fraca' }}</strong></span>
                <span>{{ strengthScore }}%</span>
              </div>
              <ul class="mt-3 grid grid-cols-1 gap-1.5 text-sm">
                <li v-for="(ok, key) in criteria" :key="key" class="flex items-center gap-2 text-sm text-gray-600">
                  <Check v-if="ok" class="w-4 h-4 text-emerald-500" />
                  <X v-else class="w-4 h-4 text-red-500" />
                  <span>{{ formatCriteriaName(key) }}</span>
                </li>
              </ul>
            </div>

            <div class="pt-4 flex justify-end gap-2">
              <button type="button" @click="closePasswordModal" class="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" :disabled="isLoading" class="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-70">
                {{ isLoading ? 'Alterando...' : 'Alterar senha' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Building, Bell, Shield, Palette, Check, X, Trash2 } from 'lucide-vue-next'

// Estados Globais
const clinicName = ref('MedAgenda Clínica')
const clinicPhone = ref('(11) 3333-4444')
const clinicAddress = ref('Rua das Flores, 123 - São Paulo, SP')

// Estados de Notificações
const notifSMS = ref(true)
const notifEmail = ref(true)
const notifSystem = ref(true)

// Modais
const isPlanModalOpen = ref(false)
const isPasswordModalOpen = ref(false)

// Estados de Senha
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

// Estados de Planos (Simulando o hook `usePlans`)
const plans = ref(['Particular', 'Unimed', 'Amil', 'SulAmérica'])
const newPlanName = ref('')

// Formatação de Telefone
const handlePhoneInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  let v = target.value.replace(/\D/g, '')
  if (v.length <= 10) {
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
    v = v.replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
    v = v.replace(/(\d{5})(\d)/, '$1-$2')
  }
  clinicPhone.value = v.substring(0, 15)
}

// Lógica de Planos
const addPlan = () => {
  if (newPlanName.value.trim() && !plans.value.includes(newPlanName.value.trim())) {
    plans.value.push(newPlanName.value.trim())
    newPlanName.value = ''
  }
}

const removePlan = (plan: string) => {
  plans.value = plans.value.filter(p => p !== plan)
}

// Lógica de Senha
const criteria = computed(() => ({
  length: newPassword.value.length >= 8,
  uppercase: /[A-Z]/.test(newPassword.value),
  lowercase: /[a-z]/.test(newPassword.value),
  number: /[0-9]/.test(newPassword.value),
  special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword.value),
}))

const strengthScore = computed(() => {
  const vals = Object.values(criteria.value).filter(Boolean).length
  return Math.min(100, Math.round((vals / Object.keys(criteria.value).length) * 100))
})

const strengthColor = computed(() => {
  if (strengthScore.value < 50) return 'bg-red-500'
  if (strengthScore.value < 80) return 'bg-amber-500'
  return 'bg-emerald-500'
})

const strengthTextClass = computed(() => {
  if (strengthScore.value < 50) return 'text-red-600'
  if (strengthScore.value < 80) return 'text-amber-600'
  return 'text-emerald-600'
})

const formatCriteriaName = (key: string) => {
  const labels: Record<string, string> = {
    length: 'Mínimo de 8 caracteres',
    uppercase: 'Letra maiúscula',
    lowercase: 'Letra minúscula',
    number: 'Número',
    special: 'Caractere especial'
  }
  return labels[key] || key
}

const closePasswordModal = () => {
  isPasswordModalOpen.value = false
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const handleChangePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    console.warn('A confirmação da senha não corresponde.')
    return
  }
  if (!Object.values(criteria.value).every(Boolean)) {
    console.warn('A senha deve cumprir todos os requisitos.')
    return
  }

  isLoading.value = true
  try {
    // ⚠️ AQUI ENTRA A CHAMADA DA API NUXT
    await new Promise(r => setTimeout(r, 1000)) // Fake delay
    
    // ⚠️ Adicione seu Toast de sucesso
    console.log('Senha alterada com sucesso.')
    closePasswordModal()
  } catch (err) {
    console.error('Erro ao alterar senha:', err)
  } finally {
    isLoading.value = false
  }
}
</script>
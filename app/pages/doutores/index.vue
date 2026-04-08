<template>
  <div class="p-8 space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dentistas</h1>
        <p class="text-gray-500 mt-1">Cadastro e gerenciamento de Dentistas.</p>
      </div>
      
      <button 
        @click="isNewDentistModalOpen = true"
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <Plus class="w-4 h-4" />
        Novo Dentista
      </button>
    </div>

    <div class="flex gap-2 max-w-md">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="searchInput"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Buscar por nome, CRO ou email..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
        />
      </div>
      <button 
        @click="handleSearch" 
        :disabled="isLoading"
        class="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        Buscar
      </button>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-emerald-600" />
    </div>

    <div v-else-if="dentists.length === 0" class="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
      <p class="text-gray-500">
        {{ searchTerm ? 'Nenhum dentista encontrado para a busca.' : 'Nenhum dentista cadastrado.' }}
      </p>
    </div>

    <template v-else>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="(doctor, index) in dentists" 
          :key="doctor.id"
          class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <span class="text-lg font-semibold text-emerald-700">
                {{ doctor.nome ? doctor.nome.charAt(0).toUpperCase() : 'D' }}
              </span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ doctor.nome }}</h3>
              <p class="text-sm text-gray-500">CRO: {{ doctor.cro || 'Não informado' }}</p>
            </div>
          </div>

          <div class="space-y-2 mb-4 flex-1">
            <div v-if="doctor.email" class="flex items-center gap-2 text-sm text-gray-600">
              <Mail class="w-4 h-4 shrink-0 text-gray-400" />
              <span class="truncate">{{ doctor.email }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Phone class="w-4 h-4 shrink-0 text-gray-400" />
              <span>{{ doctor.telefone || 'Sem telefone' }}</span>
            </div>
            
            <div v-if="doctor.especialidade" class="pt-3 border-t border-gray-100 mt-3">
              <p class="text-xs text-gray-500">
                Especialidade: <span class="font-medium text-gray-700">{{ doctor.especialidade }}</span>
              </p>
            </div>
          </div>

          <div class="pt-3 border-t border-gray-100 mt-auto">
            <button
              @click="openDeleteConfirm(doctor)"
              class="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 class="w-4 h-4" />
              Remover
            </button>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
        <button 
          @click="handlePageChange(currentPage - 1)" 
          :disabled="currentPage === 1 || isLoading"
          class="px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Anterior
        </button>
        <span class="text-sm text-gray-600 px-4 font-medium">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        <button 
          @click="handlePageChange(currentPage + 1)" 
          :disabled="currentPage === totalPages || isLoading"
          class="px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Próxima
        </button>
      </div>
    </template>

    <div v-if="openDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Remover dentista</h3>
          <p class="text-sm text-gray-500 mb-4">
            Você está removendo <strong class="text-gray-900">{{ selectedName }}</strong>. Informe o motivo da remoção.
          </p>

          <textarea 
            v-model="reason" 
            placeholder="Motivo da remoção (opcional)" 
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none h-24"
          ></textarea>
        </div>

        <div class="px-6 py-4 bg-gray-50 flex justify-end gap-2 border-t border-gray-100">
          <button 
            @click="openDelete = false"
            class="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="confirmDelete"
            :disabled="isDeleting"
            class="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Loader2 v-if="isDeleting" class="w-4 h-4 animate-spin" />
            {{ isDeleting ? 'Removendo...' : 'Confirmar remoção' }}
          </button>
        </div>
      </div>
    </div>

    <UiNovoDentista 
      :isOpen="isNewDentistModalOpen" 
      @update:isOpen="isNewDentistModalOpen = $event" 
      @success="handleNewDentistSuccess" 
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Search, Phone, Mail, Loader2, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const ITEMS_PER_PAGE = 12

// Controle de Modais
const isNewDentistModalOpen = ref(false)
const openDelete = ref(false)

// Estado de Busca e Paginação
const searchInput = ref('')
const searchTerm = ref('')
const currentPage = ref(1)

// Estado Delete
const selectedId = ref<string | null>(null)
const selectedName = ref<string | null>(null)
const reason = ref('')
const isDeleting = ref(false)

// ---------------------------------------------------------
// INTEGRAÇÃO REAL COM A BASE DE DADOS (PRISMA + NUXT API)
// ---------------------------------------------------------
const { data: dentistsData, pending: isLoading, refresh } = await useFetch('/api/dentistas')

// Computados para lidar com os dados reais
const dentists = computed(() => {
  let list = dentistsData.value || []
  
  // Se tiver termo de busca, filtra a lista
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    list = list.filter((d: any) => 
      d.nome.toLowerCase().includes(term) || 
      (d.cro && d.cro.toLowerCase().includes(term)) ||
      (d.email && d.email.toLowerCase().includes(term))
    )
  }
  return list
})

const totalItems = computed(() => dentists.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / ITEMS_PER_PAGE))

// Ações
const handleSearch = () => {
  searchTerm.value = searchInput.value
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Quando cadastrar um novo com sucesso, atualiza a lista do banco
const handleNewDentistSuccess = async () => {
  await refresh() // Recarrega os dados da API instantaneamente
}

// Gerenciamento de Remoção
const openDeleteConfirm = (doctor: any) => {
  selectedId.value = String(doctor.id)
  selectedName.value = doctor.nome
  reason.value = ''
  openDelete.value = true
}

const confirmDelete = async () => {
  if (!selectedId.value) return
  
  isDeleting.value = true
  try {
    // Aqui chamaremos a rota de delete real depois (ex: /api/dentistas/[id])
    await $fetch(`/api/dentistas/${selectedId.value}`, {
      method: 'DELETE'
    })
    
    toast.success(`Dentista ${selectedName.value} removido com sucesso.`)
    openDelete.value = false
    await refresh() // Recarrega a lista do banco
  } catch (error) {
    console.error(error)
    toast.error('Erro ao remover dentista.')
  } finally {
    isDeleting.value = false
  }
}
</script>
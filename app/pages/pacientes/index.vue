<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Search, Phone, Mail, Loader2, Trash2, Calendar } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const ITEMS_PER_PAGE = 12

// Controle de Modais
const isNewPatientModalOpen = ref(false)
const openDelete = ref(false)

// Estado de Busca e Paginação
const searchInput = ref('')
const searchTerm = ref('')
const currentPage = ref(1)

// Estado Delete
const selectedId = ref<string | null>(null)
const selectedName = ref<string | null>(null)
const isDeleting = ref(false)

// ---------------------------------------------------------
// BUSCA REAL NO BANCO DE DADOS
// ---------------------------------------------------------
const { data: patientsData, pending: isLoading, refresh } = await useFetch('/api/pacientes')

// Computados para lidar com os dados e paginação
const patients = computed(() => {
  let list = patientsData.value || []
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    list = list.filter((p: any) => 
      p.nome.toLowerCase().includes(term) || 
      (p.cpf && p.cpf.toLowerCase().includes(term)) ||
      (p.email && p.email.toLowerCase().includes(term))
    )
  }
  return list
})

const totalItems = computed(() => patients.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / ITEMS_PER_PAGE))

const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return patients.value.slice(start, end)
})

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

// Quando cadastrar um novo paciente no modal
const handleNewPatientSuccess = async () => {
  await refresh() // Atualiza a lista da tela com os dados do banco
}

// Lógica de Deletar (Preparando o terreno)
const openDeleteConfirm = (patient: any) => {
  selectedId.value = String(patient.id)
  selectedName.value = patient.nome
  openDelete.value = true
}

const confirmDelete = async () => {
  if (!selectedId.value) return
  
  isDeleting.value = true
  try {
    // A rota de delete criaremos depois: await $fetch(`/api/pacientes/${selectedId.value}`, { method: 'DELETE' })
    toast.success(`Paciente ${selectedName.value} removido com sucesso. (Simulação)`)
    openDelete.value = false
    // await refresh()
  } catch (error) {
    toast.error('Erro ao remover paciente.')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Pacientes</h1>
      <button 
        @click="isNewPatientModalOpen = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <Plus class="w-5 h-5" />
        Novo Paciente
      </button>
    </div>

    <div class="mb-6 flex gap-2">
      <div class="relative flex-1 max-w-md">
        <Search class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        <input 
          v-model="searchInput"
          @keyup.enter="handleSearch"
          type="text" 
          placeholder="Buscar por nome, CPF ou e-mail..."
          class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button 
        @click="handleSearch"
        class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
      >
        Buscar
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-blue-600" />
      <span class="ml-2 text-gray-600">Carregando pacientes...</span>
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="paginatedPatients.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-gray-500">
              Nenhum paciente encontrado.
            </td>
          </tr>
          <tr v-for="patient in paginatedPatients" :key="patient.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">{{ patient.nome }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex items-center gap-1"><Phone class="w-4 h-4"/> {{ patient.telefone || '-' }}</div>
              <div class="flex items-center gap-1 mt-1"><Mail class="w-4 h-4"/> {{ patient.email || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ patient.cpf || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openDeleteConfirm(patient)" class="text-red-600 hover:text-red-900 flex items-center justify-end gap-1 w-full">
                <Trash2 class="w-4 h-4" /> Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UiNovoPaciente 
      :isOpen="isNewPatientModalOpen"
      @update:isOpen="isNewPatientModalOpen = $event"
      @success="handleNewPatientSuccess"
    />
    
    <div v-if="openDelete" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-sm w-full text-center">
        <h3 class="text-lg font-bold mb-2">Excluir Paciente</h3>
        <p class="text-gray-600 mb-6">Tem certeza que deseja excluir <strong>{{ selectedName }}</strong>?</p>
        <div class="flex justify-center gap-4">
          <button @click="openDelete = false" class="px-4 py-2 border rounded hover:bg-gray-50">Cancelar</button>
          <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            {{ isDeleting ? 'Excluindo...' : 'Sim, Excluir' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
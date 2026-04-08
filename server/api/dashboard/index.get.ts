import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Definindo o início e o fim do dia de hoje para os filtros
    const hoje = new Date()
    const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0))
    const fimDoDia = new Date(hoje.setHours(23, 59, 59, 999))
    
    // Definindo a data de daqui a 7 dias
    const daqui7Dias = new Date()
    daqui7Dias.setDate(daqui7Dias.getDate() + 7)

    // Fazendo todas as consultas simultaneamente para maior performance
    const [
      pacientesTotal,
      pacientesAtivos,
      dentistasAtivos,
      consultasHoje,
      consultasProximos7Dias,
      consultasConcluidasHoje,
      consultasAguardando,
      listaConsultasHoje
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({ where: { ativo: true } }),
      prisma.dentist.count({ where: { ativo: true } }),
      
      // Consultas de hoje (qualquer status)
      prisma.appointment.count({
        where: { dataHoraInicio: { gte: inicioDoDia, lte: fimDoDia } }
      }),
      
      // Consultas dos próximos 7 dias
      prisma.appointment.count({
        where: { dataHoraInicio: { gt: fimDoDia, lte: daqui7Dias } }
      }),
      
      // Consultas concluídas hoje
      prisma.appointment.count({
        where: { 
          dataHoraInicio: { gte: inicioDoDia, lte: fimDoDia },
          status: 'concluida' 
        }
      }),
      
      // Consultas aguardando atendimento hoje
      prisma.appointment.count({
        where: { 
          dataHoraInicio: { gte: inicioDoDia, lte: fimDoDia },
          status: 'aguardando' 
        }
      }),

      // A lista de consultas que vai aparecer na parte de baixo do Dashboard
      prisma.appointment.findMany({
        where: { dataHoraInicio: { gte: inicioDoDia, lte: fimDoDia } },
        include: { paciente: true, dentista: true },
        orderBy: { dataHoraInicio: 'asc' }
      })
    ])

    // Retornamos tudo organizadinho para o frontend
    return {
      cards: {
        consultasHoje,
        consultasProximos7Dias,
        pacientesAtivos,
        pacientesTotal,
        consultasConcluidasHoje,
        consultasAguardando,
        dentistasAtivos
      },
      listaHoje: listaConsultasHoje
    }

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
    throw createError({ statusCode: 500, statusMessage: 'Erro ao carregar dados do dashboard.' })
  }
})
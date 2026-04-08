import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { filtro } = getQuery(event)

  // Limites do dia atual em UTC para consistência com os dados do banco
  const agora = new Date()
  const inicioDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0, 0)
  const fimDia    = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999)

  type WhereClause = { dataHoraInicio?: { gte?: Date; lte?: Date; gt?: Date; lt?: Date } }
  let where: WhereClause = {}
  let orderDirection: 'asc' | 'desc' = 'asc'

  if (filtro === 'hoje') {
    // Agendamentos que começam dentro do dia de hoje
    where = { dataHoraInicio: { gte: inicioDia, lte: fimDia } }
  } else if (filtro === 'historico') {
    // Agendamentos que começaram antes de hoje — mais recente primeiro
    where = { dataHoraInicio: { lt: inicioDia } }
    orderDirection = 'desc'
  } else {
    // 'proximos' é o padrão — agendamentos do futuro (após o fim do dia de hoje)
    where = { dataHoraInicio: { gt: fimDia } }
  }

  try {
    const agendamentos = await prisma.appointment.findMany({
      where,
      orderBy: { dataHoraInicio: orderDirection },
      include: {
        paciente: true,
        dentista: true,
      },
    })

    return agendamentos
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao buscar a agenda.',
    })
  }
})
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do agendamento inválido.',
    })
  }

  try {
    const agendamento = await prisma.appointment.findUnique({
      where: { id: Number(id) },
      include: {
        paciente: true,
        dentista: true,
      },
    })

    if (!agendamento) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Agendamento não encontrado.',
      })
    }

    return agendamento
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    console.error('Erro ao buscar agendamento:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao buscar agendamento.',
    })
  }
})

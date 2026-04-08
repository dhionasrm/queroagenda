import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID inválido.',
    })
  }

  try {
    await prisma.appointment.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao excluir o agendamento.',
    })
  }
})

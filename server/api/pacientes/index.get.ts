import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const pacientes = await prisma.patient.findMany({
      orderBy: {
        nome: 'asc'
      }
    })
    
    return pacientes
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao buscar pacientes na base de dados.'
    })
  }
})
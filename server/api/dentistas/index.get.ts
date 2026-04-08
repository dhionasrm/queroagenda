import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Trocamos de prisma.dentista para prisma.dentist
    const dentistas = await prisma.dentist.findMany({
      orderBy: {
        nome: 'asc'
      }
    })
    
    return dentistas
  } catch (error) {
    console.error('Erro ao buscar dentistas:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao buscar dentistas na base de dados.'
    })
  }
})
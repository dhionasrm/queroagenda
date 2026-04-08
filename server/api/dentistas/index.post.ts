import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Trocamos de prisma.dentista para prisma.dentist
    const novoDentista = await prisma.dentist.create({
      data: {
        nome: body.nome,
        cro: body.cro,
        email: body.email,
        telefone: body.telefone,
        especialidade: body.especialidade
        // ativo, createdAt e updatedAt já são preenchidos automaticamente pelos @default
      }
    })

    return novoDentista
  } catch (error) {
    console.error('Erro ao criar dentista:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao salvar dentista.'
    })
  }
})
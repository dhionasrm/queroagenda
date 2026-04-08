import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Converte a data de nascimento se ela foi preenchida no form
    let dataNasc = null
    if (body.dataNascimento) {
      // O form envia YYYY-MM-DD, o Prisma espera um objeto Date válido
      dataNasc = new Date(`${body.dataNascimento}T00:00:00Z`) 
    }

    const novoPaciente = await prisma.patient.create({
      data: {
        nome: body.nome,
        // Se o campo vier vazio do front, salvamos como null para respeitar o banco
        cpf: body.cpf || null,
        email: body.email || null,
        telefone: body.telefone || null,
        dataNascimento: dataNasc,
        tipoAtendimento: body.tipoAtendimento || null,
        observacoes: body.observacoes || null
      }
    })

    return novoPaciente
  } catch (error) {
    console.error('Erro ao criar paciente:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao salvar paciente.'
    })
  }
})
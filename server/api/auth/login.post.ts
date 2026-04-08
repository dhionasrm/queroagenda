import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  try {
    // 1. Busca o usuário apenas pelo email e verifica se está ativo
    const user = await prisma.user.findFirst({
      where: {
        email: username,
        ativo: true
      }
    })

    // Se não encontrou o email, ou o usuário está inativo, já trava aqui
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário ou senha incorretos'
      })
    }

    // 2. Compara a senha digitada com a senha criptografada do banco
    const isPasswordValid = await bcrypt.compare(password, user.senhaHash)

    // Se a senha não bater, trava aqui
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuário ou senha incorretos'
      })
    }

    // 3. Remove o hash da senha por segurança antes de enviar os dados para a tela
    const { senhaHash, ...userData } = user

    // Sucesso total!
    return {
      success: true,
      user: userData
    }

  } catch (error: any) {
    console.error('Erro no login:', error)
    
    // Se for um erro que nós mesmos criamos (401), repassa para o frontend
    if (error.statusCode === 401) throw error
    
    // Se for erro do banco (ex: caiu a conexão), mostra erro 500
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno no servidor'
    })
  }
})
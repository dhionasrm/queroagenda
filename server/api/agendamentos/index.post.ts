import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const pacienteId = Number(body.pacienteId)
  const dentistaId = Number(body.dentistaId)

  if (!pacienteId || !dentistaId || !body.dataHoraInicio) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Campos obrigatórios ausentes: pacienteId, dentistaId e dataHoraInicio.',
    })
  }

  const dataHoraInicio = new Date(body.dataHoraInicio)
  // Se o front não enviar dataHoraFim, usa +1 hora como padrão
  const dataHoraFim = body.dataHoraFim
    ? new Date(body.dataHoraFim)
    : new Date(dataHoraInicio.getTime() + 60 * 60 * 1000)

  try {
    const novoAgendamento = await prisma.appointment.create({
      data: {
        pacienteId,
        dentistaId,
        dataHoraInicio,
        dataHoraFim,
        procedimento: body.procedimento ?? null,
        convenio: body.convenio ?? null,
        valorPrevisto: body.valorPrevisto ? Number(body.valorPrevisto) : null,
        origemAgendamento: body.origemAgendamento ?? 'recepcao',
        observacoes: body.observacoes ?? null,
      },
    })

    return novoAgendamento
  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno ao salvar o agendamento.',
    })
  }
})
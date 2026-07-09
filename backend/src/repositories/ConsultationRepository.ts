import type { PrismaClient, Consulta } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class ConsultationRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTodasConsultas(pacienteId?: number) {
        const consultas = await prisma.consulta.findMany({
            ...(pacienteId ? {
                where: {
                    paciente_id: pacienteId
                }
            } : {}),
            include: {
                paciente: true
            },
            orderBy: {
                data_consulta: "desc"
            }
        })
        return consultas
    }

    async buscarConsultaId(idConsulta: number) {
        const consulta = await prisma.consulta.findUnique({
            where: {
                id: idConsulta
            },
            include: {
                paciente: true
            }
        })
        return consulta
    }

    async criarConsulta(dadosConsulta: Partial<Consulta>) {
        console.log(dadosConsulta);
        return await this.prisma.consulta.create({
            data: {
                motivo: dadosConsulta.motivo || "",
                data_consulta: new Date(dadosConsulta.data_consulta || ""),
                observacoes: dadosConsulta.observacoes || "",
                medico_responsavel_id: Number(dadosConsulta.medico_responsavel_id),
                paciente_id: Number(dadosConsulta.paciente_id)
            }
        })
    }

    async atualizarConsulta(idConsulta: number, dadosParaAtualizar: Omit<Consulta, 'id'>){
        const consultaAtualizada = await prisma.consulta.update({
            data: {
                ...dadosParaAtualizar,
                motivo: dadosParaAtualizar.motivo,
                observacoes: dadosParaAtualizar.observacoes,
                medico_responsavel_id: dadosParaAtualizar.medico_responsavel_id,
                data_consulta: new Date(dadosParaAtualizar.data_consulta)
            },
            where: {
                id: idConsulta
            }
        })
        return consultaAtualizada
    }

    async deletarConsulta(idConsulta: number) {
        const consulta = await prisma.consulta.delete({
            where: {
                id: idConsulta
            }
        })
        return consulta;
    }

}

export const consultationRepository = new ConsultationRepository(prisma)

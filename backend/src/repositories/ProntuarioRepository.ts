import type { PrismaClient, Prontuario } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class ProntuarioRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTodosProntuarios(pacienteId?: number) {
        const prontuario = await prisma.prontuario.findMany({
            ...(pacienteId ? {
                where: {
                    paciente_id: pacienteId
                }
            } : {}),
            include: {
                paciente: true,
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                }
            },
            orderBy: {
                data_prontuario: "desc"
            }
        })
        return prontuario
    }

    async buscarProntuarioId(idProntuario: number) {
        const prontuario = await prisma.prontuario.findUnique({
            where: {
                id: idProntuario
            },
            include: {
                paciente: true,
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                }
            }
        })
        return prontuario
    }

    async criarProntuario(dadosProntuario: Partial<Prontuario>) {
        console.log({
            descricao: dadosProntuario.descricao,
            data_prontuario: dadosProntuario.data_prontuario,
            medico_responsavel_id: dadosProntuario.medico_responsavel_id,
            paciente_id: dadosProntuario.paciente_id
        });
        console.log("dadosProntuario", dadosProntuario);
        console.log("paciente_id", dadosProntuario.paciente_id);
        console.log("medico_responsavel_id", dadosProntuario.medico_responsavel_id);


        return await this.prisma.prontuario.create({
            data: {
                descricao: dadosProntuario.descricao || "",
                data_prontuario: new Date(dadosProntuario.data_prontuario || ""),
                medico_responsavel_id: Number(dadosProntuario.medico_responsavel_id),
                paciente_id: Number(dadosProntuario.paciente_id)
            }
        })
    }

    async atualizarProntuario(idProntuario: number, dadosParaAtualizar: Omit<Prontuario, 'id'>) {
        const prontuarioAtualizada = await prisma.prontuario.update({
            data: {
                ...dadosParaAtualizar,
                descricao: dadosParaAtualizar.descricao,
                medico_responsavel_id: dadosParaAtualizar.medico_responsavel_id,
                data_prontuario: new Date(dadosParaAtualizar.data_prontuario || "")
            },
            where: {
                id: idProntuario
            }
        })
        return prontuarioAtualizada
    }

    async deletarProntuario(idProntuario: number) {
        const prontuario = await prisma.prontuario.delete({
            where: {
                id: idProntuario
            }
        })
        return prontuario;
    }

}

export const prontuarioRepository = new ProntuarioRepository(prisma)

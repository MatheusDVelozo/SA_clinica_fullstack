import type { Exame, PrismaClient, Token, } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";

export class ExamRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTodosExames(pagina?: number, limite?: number, pacienteId?: number) {
        const where = pacienteId ? {
            paciente_id: pacienteId
        } : undefined
        const existePaginacao = pagina! && limite!
        if (!existePaginacao) return await prisma.exame.findMany({
            ...(where ? { where } : {}),
            include: {
                paciente: true
            },
            orderBy: {
                data_exame: "desc"
            }
        })
        const exames = await prisma.exame.findMany({
            ...(where ? { where } : {}),
            include: {
                paciente: true
            },
            orderBy: {
                data_exame: "desc"
            },
            skip: (pagina - 1) * limite,
            take: limite
        })

        const total = where ? await prisma.exame.count({ where }) : await prisma.exame.count();
        const totalPaginas = Math.ceil(total / limite)
        return {
            exames,
            total,
            totalPaginas
        }
    }

    async buscarExameId(idExame: number) {
        const exame = await prisma.exame.findUnique({
            where: {
                id: idExame
            },
            include: {
                paciente: true
            }
        })

        return exame;
    }

    async criarExame(dadosExame: Partial<Exame>) {
        return await this.prisma.exame.create({
            data: {
                tipo_exame: dadosExame.tipo_exame || "",
                valor: dadosExame.valor ?? 0,
                descricao: dadosExame.descricao || "",
                data_exame: new Date(dadosExame.data_exame || ""),
                resultado: dadosExame.resultado || "",
                paciente_id: Number(dadosExame.paciente_id)
            }
        })
    }

    async atualizarExame(idExame: number, dadosParaAtualizar: Omit<Exame, 'id'>) {
        const exameAtualizado = await prisma.exame.update({
            data: {
                ...dadosParaAtualizar,
                tipo_exame: dadosParaAtualizar.tipo_exame,
                valor: dadosParaAtualizar.valor,
                descricao: dadosParaAtualizar.descricao,
                resultado: dadosParaAtualizar.resultado,
                data_exame: new Date(dadosParaAtualizar.data_exame)
            },
            where: {
                id: idExame
            }
        })

        return exameAtualizado;
    }

    async deletarExame(idExame: number) {
        const exame = await prisma.exame.delete({
            where: {
                id: idExame
            }
        })
        return exame;
    }
}



export const examRepository = new ExamRepository(prisma)

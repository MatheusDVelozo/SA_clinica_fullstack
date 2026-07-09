
import type { PrismaClient } from "@prisma/client/extension";
import { prisma } from "../prisma/prisma";
import type { Paciente } from "../prisma/generated/prisma/client";

export class PatientRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarTodosPacientes() {
        const pacientes = await prisma.paciente.findMany({
            orderBy: {
                id: "desc"
            }
        })
        return pacientes
    }

    async buscarPacienteId(idPaciente: number) {
        const paciente = await prisma.paciente.findUnique({
            where: {
                id: idPaciente
            },
            include: {
                Consulta: true,
                Exame: true,
                Prontuario: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nome: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })
        return paciente
    }

    async criarPaciente(dadosPaciente: Partial<Paciente>) {
        console.log(dadosPaciente);
        return await this.prisma.paciente.create({
            data: {
                nome: dadosPaciente.nome || "",
                cpf: dadosPaciente.cpf || "",
                telefone: dadosPaciente.telefone || "",
                email: dadosPaciente.email || "",
                data_nascimento: new Date(dadosPaciente.data_nascimento || ""),
                sexo: dadosPaciente.sexo || "",
                responsavel: dadosPaciente.responsavel || ""
            }
        })
    }

    async atualizarPaciente(idPaciente: number, dadosParaAtualizar: Omit<Paciente, 'id'>) {
        const pacineteAtualizado = await prisma.paciente.update({
            data: {
                ...dadosParaAtualizar,
                telefone: dadosParaAtualizar.telefone,
                email: dadosParaAtualizar.email,
                responsavel: dadosParaAtualizar.responsavel
            },
            where: {
                id: idPaciente
            }
        })
        return pacineteAtualizado
    }

    async deletarPaciente(idPaciente: number) {
        const paciente = await prisma.paciente.delete({
            where: {
                id: idPaciente
            }
        })
        return paciente;
    }

}

export const pacienteRepository = new PatientRepository(prisma)

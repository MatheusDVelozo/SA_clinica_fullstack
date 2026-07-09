import type { Exame, } from "../prisma/generated/prisma/client";
import { examRepository, type ExamRepository } from "../repositories/ExamRepository";

export class ExamService {
    constructor(private readonly repository: ExamRepository) { // TO-DO TIPAR SERVICE
    }

    async listarTodosExames(pagina?: number, limite?: number, pacienteId?: number) {
        const exames = await this.repository.listarTodosExames(pagina, limite, pacienteId)
        return exames
    }

    async criarExame(dadosExame: Exame) {

        const exameCriado = await this.repository.criarExame({
            tipo_exame: dadosExame.tipo_exame,
            valor: dadosExame.valor || 0,
            descricao: dadosExame.descricao,
            data_exame: new Date(dadosExame.data_exame),
            resultado: dadosExame.resultado,
            paciente_id: Number(dadosExame.paciente_id)
        })
        return exameCriado
    }

    async buscarExameId(idExame: number) {
        const exame = await this.repository.buscarExameId(idExame);
        return exame;
    }

    async atualizarExame(idExame: number, dadosParaAtualizar: Omit<Exame, 'id'>) {
        const exameAtualizado = await this.repository.atualizarExame(idExame, dadosParaAtualizar)
        return exameAtualizado;
    }


    async deletarExame(idExame: number) {
        const exame = await this.repository.deletarExame(idExame);
        return exame;
    }
}

export const examService = new ExamService(examRepository)

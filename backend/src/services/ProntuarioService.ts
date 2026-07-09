import type { Prontuario } from "../prisma/generated/prisma/client";
import { prontuarioRepository, ProntuarioRepository } from "../repositories/ProntuarioRepository";

export class ProntuarioService {
    constructor(private readonly repository: ProntuarioRepository) { // TO-DO TIPAR SERVICE
    }

    async listarTodosProntuarios(pacienteId?: number) {
        const prontuario = await this.repository.listarTodosProntuarios(pacienteId)
        return prontuario
    }

    async criarProntuario(dadosProntuario: Prontuario) {

        const prontuarioCriado = await this.repository.criarProntuario({
                descricao: dadosProntuario.descricao || "",
                data_prontuario: new Date(dadosProntuario.data_prontuario || ""),
                medico_responsavel_id: Number(dadosProntuario.medico_responsavel_id),
                paciente_id: Number(dadosProntuario.paciente_id)
        })
        return prontuarioCriado
    }

    async buscarProntuarioId(idProntuario: number) {
        const prontuario = await this.repository.buscarProntuarioId(idProntuario);
        return prontuario;
    }

    async atualizarProntuario(idProntuario: number, dadosParaAtualizar: Omit<Prontuario, 'id'>) {
        const prontuarioAtualizada = await this.repository.atualizarProntuario(idProntuario, dadosParaAtualizar)
        return prontuarioAtualizada;
    }


    async deletarProntuario(idProntuario: number) {
        const prontuario = await this.repository.deletarProntuario(idProntuario);
        return prontuario;
    }
}

export const prontuarioService = new ProntuarioService(prontuarioRepository)

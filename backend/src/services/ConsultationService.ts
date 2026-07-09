import type { Consulta } from "../prisma/generated/prisma/client";
import { consultationRepository, type ConsultationRepository } from "../repositories/ConsultationRepository";

export class ConsultationService {
    constructor(private readonly repository: ConsultationRepository) { // TO-DO TIPAR SERVICE
    }

    async listarTodasConsultas(pacienteId?: number) {
        const consultas = await this.repository.listarTodasConsultas(pacienteId)
        return consultas
    }

    async criarConsulta(dadosConsulta: Consulta) {

        const consultaCriada = await this.repository.criarConsulta({
                motivo: dadosConsulta.motivo || "",
                data_consulta: new Date(dadosConsulta.data_consulta || ""),
                observacoes: dadosConsulta.observacoes || "",
                medico_responsavel_id: Number(dadosConsulta.medico_responsavel_id),
                paciente_id: Number(dadosConsulta.paciente_id)
        })
        return consultaCriada
    }

    async buscarConsultaId(idConsulta: number) {
        const consulta = await this.repository.buscarConsultaId(idConsulta);
        return consulta;
    }

    async atualizarConsulta(idConsulta: number, dadosParaAtualizar: Omit<Consulta, 'id'>) {
        const consultaAtualizada = await this.repository.atualizarConsulta(idConsulta, dadosParaAtualizar)
        return consultaAtualizada;
    }


    async deletarConsulta(idConsulta: number) {
        const consulta = await this.repository.deletarConsulta(idConsulta);
        return consulta;
    }
}

export const consultationService = new ConsultationService(consultationRepository)

import type { Request, Response } from "express";
import type { Consulta, Exame, Usuario } from "../prisma/generated/prisma/client"
import { examService, ExamService } from "../services/ExamService";
import { ConsultationService, consultationService } from "../services/ConsultationService";


class ConsultationController {
    constructor(private readonly service: ConsultationService) {
    }

    async listarTodasConsultas(req: Request, res: Response) {
        try {
            const pacienteId = req.query.paciente_id ? Number(req.query.paciente_id) : undefined
            const consultas = await this.service.listarTodasConsultas(pacienteId);
            return res.status(200).json(consultas)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async criarConsulta(req: Request, res: Response) {
        try {
            const dadosConsulta = req.body as Consulta
            const consultaCriada = await this.service.criarConsulta(dadosConsulta)
            return res.status(201).json(consultaCriada)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async buscarConsultaId(req: Request, res: Response) {
        try {
            const idConsulta = Number(req.params.id)
            const consulta = await this.service.buscarConsultaId(idConsulta)
            return res.status(200).json(consulta)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async atualizarConsulta(req: Request, res: Response) {
        try {
            const idConsulta = Number(req.params.id)
            const dadosParaAtualizar = req.body as Omit<Consulta, 'id'>
            const consultaAtualizada = await this.service.atualizarConsulta(idConsulta, dadosParaAtualizar)
            return res.status(200).json(consultaAtualizada);
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }


    async deletarConsulta(req: Request, res: Response) {
        try {
            const idConsulta = Number(req.params.id)
            const consulta = await this.service.deletarConsulta(idConsulta)
            return res.status(200).json({
                mensagem: "Consulta deletada com sucesso!",
                data: consulta
            });
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }
}
export const consultationController = new ConsultationController(consultationService)

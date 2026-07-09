import type { Request, Response } from "express";
import type { Prontuario } from "../prisma/generated/prisma/client"
import { prontuarioService, ProntuarioService } from "../services/ProntuarioService";


class ProntuarioController {
    constructor(private readonly service: ProntuarioService) {
    }

    async listarTodosProntuarios(req: Request, res: Response) {
        try {
            const pacienteId = req.query.paciente_id ? Number(req.query.paciente_id) : undefined
            const prontuario = await this.service.listarTodosProntuarios(pacienteId);
            return res.status(200).json(prontuario)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async criarProntuario(req: Request, res: Response) {
        try {
            const dadosProntuario = req.body as Prontuario
            const prontuarioCriado = await this.service.criarProntuario(dadosProntuario)
            return res.status(201).json(prontuarioCriado)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async buscarProntuarioId(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id)
            const prontuario = await this.service.buscarProntuarioId(idProntuario)
            return res.status(200).json(prontuario)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async atualizarProntuario(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id)
            const dadosParaAtualizar = req.body as Omit<Prontuario, 'id'>
            const prontuarioCriado = await this.service.atualizarProntuario(idProntuario, dadosParaAtualizar)
            return res.status(200).json(prontuarioCriado);
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }


    async deletarProntuario(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id)
            const prontuario = await this.service.deletarProntuario(idProntuario)
            return res.status(200).json({
                mensagem: "Consulta deletada com sucesso!",
                data: prontuario
            });
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }
}
export const prontuarioController = new ProntuarioController(prontuarioService)

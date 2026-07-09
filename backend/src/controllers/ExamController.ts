import type { Request, Response } from "express";
import type { Exame, Usuario } from "../prisma/generated/prisma/client"
import { examService, ExamService } from "../services/ExamService";


class ExamController {
    constructor(private readonly service: ExamService) {
    }

    async listarTodosExames(req: Request, res: Response) {
        try {
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined
            const pacienteId = req.query.paciente_id ? Number(req.query.paciente_id) : undefined

            const exames = await this.service.listarTodosExames(pagina, limite, pacienteId);
            return res.status(200).json(exames)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async criarExame(req: Request, res: Response) {
        try {
            const dadosExame = req.body as Exame
            const exameCriado = await this.service.criarExame(dadosExame)
            return res.status(201).json(exameCriado)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async buscarExameId(req: Request, res: Response) {
        try {
            const idExame = Number(req.params.id)
            const exame = await this.service.buscarExameId(idExame)
            return res.status(200).json(exame)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }

    async atualizarExame(req: Request, res: Response) {
        try {
            const idExame = Number(req.params.id)
            const dadosParaAtualizar = req.body as Omit<Exame, 'id'>
            const exameAtualizado = await this.service.atualizarExame(idExame, dadosParaAtualizar)
            return res.status(200).json(exameAtualizado);
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }


    async deletarExame(req: Request, res: Response) {
        try {
            const idExame = Number(req.params.id)
            const exame = await this.service.deletarExame(idExame)
            return res.status(200).json({
                mensagem: "Usuário deletado com sucesso!",
                data: exame
            });
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                error
            })
        }
    }
}
export const examController = new ExamController(examService)

import { RemedioRepository } from "../../repository/remedio/remedio.repository.js";

const remedioRepo = new RemedioRepository();

export class RemedioService {
    async retornarRemedios() {
        const remedios = await remedioRepo.buscarRemedios();

        if(!remedios){
            throw{
                statusCode: 404,
                message: "Nenhum remedio encontrado."
            };
        }

        return remedios;
    }
}
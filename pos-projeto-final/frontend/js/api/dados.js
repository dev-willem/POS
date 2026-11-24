import { listarCorridas } from "./corridas.js";
import { listarProfessores } from "./professores.js";
import { listarCheckpoints } from "./checkpoints.js";

// Carrega os tres recursos e reconstroi as referencias dos checkpoints
export async function carregarDados() {
    const [corridas, professores] = await Promise.all([listarCorridas(), listarProfessores()]);
    const checkpoints = await listarCheckpoints(corridas, professores);
    return { corridas, professores, checkpoints };
}

import os from "os";
import { Metrics } from "../interfaces/metrics.interface";
import { check } from "diskusage";
import { isServerAvailable } from "../utils/serverUtils";

async function getDiskUsage(path: string) {
  try {
    const { available, free, total } = await check(path);

    return {
      available: (available / 1e9).toFixed(2),
      free: (free / 1e9).toFixed(2),
      total: (total / 1e9).toFixed(2)
    }
    
  } catch (error) {
    console.error("Erro ao obter informações de disco:", error);
  }
}

export const getServerMetrics = async (): Promise<Metrics> => {
  const freeMemory = os.freemem();
  const totalMemory = os.totalmem();

  const diskUsage = await getDiskUsage("/");
  const serverAvailable = await isServerAvailable("http://bondedorpg.online:30000/game", 30000);


  return {
    cpuUsage: os.loadavg(),
    freeMemory: (freeMemory / 1e9).toFixed(2),
    totalMemory: (totalMemory / 1e9).toFixed(2),
    uptime: os.uptime(),
    hostName: os.hostname(),
    machine: os.machine(),
    plataform: os.platform(),
    diskUsage: diskUsage || { available: "0", free: "0", total: "0" },
    serverAvailable, 
  };
};

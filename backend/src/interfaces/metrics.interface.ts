export interface Metrics {
  cpuUsage: number[];
  freeMemory: string;
  totalMemory: string;
  uptime: number;
  hostName: string;
  machine: string;
  plataform: string;
  diskUsage: { available: string, free: string, total: string };
  serverAvailable?: boolean;
}
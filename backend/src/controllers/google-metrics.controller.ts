import { google } from "googleapis";
import {
  MetricPoint,
  MetricSeries,
  MetricResponse,
} from "../interfaces/google-metrics.interface";

// Função para buscar métricas individuais
const fetchMetric = async (
  metricType: string,
  startTime: string,
  endTime: string,
  projectId: string
): Promise<MetricSeries[]> => {
  const monitoring = google.monitoring("v3");

  const params = {
    name: `projects/${projectId}`,
    filter: `metric.type="${metricType}"`,
    "interval.startTime": startTime,
    "interval.endTime": endTime,
  };

  const response = await monitoring.projects.timeSeries.list(params);

  // Processar as métricas retornadas
  return (
    response.data.timeSeries?.map((series) => {
      const points =
        series.points?.map((point) => ({
          interval: {
            startTime: point.interval?.startTime || "",
            endTime: point.interval?.endTime || "",
          },
          value: {
            doubleValue: point.value?.doubleValue ?? undefined,
            int64Value: point.value?.int64Value ?? undefined,
            stringValue: point.value?.stringValue ?? undefined,
          },
        })) || [];

      return {
        metric: {
          type: series.metric?.type || "unknown",
          labels: series.metric?.labels || {},
        },
        resource: {
          type: series.resource?.type || "unknown",
          labels: series.resource?.labels || {},
        },
        points,
      } as MetricSeries;
    }) || []
  );
};

// Função principal para buscar e consolidar métricas
export const googleMetrics = async (): Promise<MetricResponse | null> => {
  try {
    // Autenticação
    const authClient = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
    google.options({ auth: authClient });

    const projectId = "global-brook-308504";
    const now = new Date();
    const endTime = now.toISOString();
    const startTime = new Date(now.getTime() - 60 * 1000).toISOString();

    // Lista de métricas a buscar
    const metricTypes = [
      "compute.googleapis.com/instance/cpu/utilization",
      "agent.googleapis.com/memory/percent_used",
      "agent.googleapis.com/disk/percent_used",
    ];

    // Buscar todas as métricas de forma sequencial
    const metricsByType: Record<string, MetricSeries[]> = {};

    for (const metricType of metricTypes) {
      try {
        const metricData = await fetchMetric(
          metricType,
          startTime,
          endTime,
          projectId
        );
        metricsByType[metricType] = metricData;
      } catch (error) {
        if (error instanceof Error) {
          console.warn(`Erro ao buscar métrica ${metricType}:`, error.message);
        } else {
          console.warn(`Erro ao buscar métrica ${metricType}:`, error);
        }
      }
    }

    // Verifica se houve algum dado retornado
    if (Object.keys(metricsByType).length === 0) {
      console.warn(
        "Nenhuma métrica encontrada no intervalo de tempo especificado."
      );
      return null;
    }

    // Retorna as métricas agrupadas e processadas
    return { timeSeries: metricsByType };
  } catch (error) {
    console.error("Error fetching metrics:", error);
    throw error;
  }
};

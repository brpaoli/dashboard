export interface MetricPoint {
  interval?: {
    startTime?: string;
    endTime?: string;
  };
  value?: {
    doubleValue?: number | null;
    int64Value?: string | null;
    stringValue?: string | null;
  };
}

export interface MetricSeries {
  metric?: {
    type?: string;
    labels?: Record<string, string>;
  };
  resource?: {
    type?: string;
    labels?: Record<string, string>;
  };
  points: MetricPoint[];
}

export interface MetricResponse {
  timeSeries: Record<string, MetricSeries[]>;
}

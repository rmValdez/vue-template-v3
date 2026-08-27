interface ErrorReport {
  message: string;
  code?: string;
  status?: number;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

class TelemetryService {
  private reports: ErrorReport[] = [];

  logError(error: unknown, context?: Record<string, unknown>): void {
    const err = error instanceof Error ? error : new Error(String(error));
    const report: ErrorReport = {
      message: err.message,
      stack: err.stack,
      context,
      timestamp: new Date().toISOString()
    };

    this.reports.push(report);

    if (import.meta.env.DEV) {
      console.error('[Telemetry Error Report]', report);
    }
  }

  getRecentReports(): ErrorReport[] {
    return [...this.reports];
  }
}

export const telemetry = new TelemetryService();

type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: Record<string, unknown>;
  error?: unknown;
}

class AppLogger {
  private isDev = process.env.NODE_ENV !== "production";

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(entry: LogEntry): string {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.context}]`;
    return `${prefix} ${entry.message}`;
  }

  /**
   * Log informational application events.
   */
  info(message: string, context = "App", data?: Record<string, unknown>) {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: "info",
      context,
      message,
      data,
    };
    if (data) {
      console.log(this.formatMessage(entry), JSON.stringify(data, null, 2));
    } else {
      console.log(this.formatMessage(entry));
    }
  }

  /**
   * Log warnings and potential issues.
   */
  warn(message: string, context = "App", data?: Record<string, unknown>) {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: "warn",
      context,
      message,
      data,
    };
    if (data) {
      console.warn(this.formatMessage(entry), JSON.stringify(data, null, 2));
    } else {
      console.warn(this.formatMessage(entry));
    }
  }

  /**
   * Log unexpected errors and exceptions.
   */
  error(message: string, context = "App", error?: unknown, data?: Record<string, unknown>) {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      level: "error",
      context,
      message,
      data,
      error,
    };
    console.error(this.formatMessage(entry));
    if (error) {
      console.error("Error Stack/Details:", error);
    }
    if (data) {
      console.error("Context Data:", JSON.stringify(data, null, 2));
    }
  }

  /**
   * Log fine-grained debugging details (enabled in dev or when DEBUG env variable is set).
   */
  debug(message: string, context = "App", data?: Record<string, unknown>) {
    if (this.isDev || process.env.DEBUG === "true") {
      const entry: LogEntry = {
        timestamp: this.getTimestamp(),
        level: "debug",
        context,
        message,
        data,
      };
      if (data) {
        console.debug(this.formatMessage(entry), JSON.stringify(data, null, 2));
      } else {
        console.debug(this.formatMessage(entry));
      }
    }
  }
}

export const logger = new AppLogger();

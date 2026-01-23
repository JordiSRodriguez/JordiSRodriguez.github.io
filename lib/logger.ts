/**
 * Logger utility that only logs in development environment
 * Prevents console statements from appearing in production builds
 */

type LogLevel = "log" | "error" | "warn" | "info" | "debug";

const isDevelopment = process.env.NODE_ENV === "development";

type Logger = {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
  group: (label: string) => void;
  groupCollapsed: (label: string) => void;
  groupEnd: () => void;
  table: (data: unknown) => void;
  time: (label: string) => void;
  timeEnd: (label: string) => void;
  trace: (...args: unknown[]) => void;
};

const logger: Logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Group logger for grouping related console messages
   */
  group: (label: string) => {
    if (isDevelopment) {
      console.group(label);
    }
  },

  groupCollapsed: (label: string) => {
    if (isDevelopment) {
      console.groupCollapsed(label);
    }
  },

  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },

  /**
   * Table logger for displaying tabular data
   */
  table: (data: unknown) => {
    if (isDevelopment) {
      console.table(data);
    }
  },

  /**
   * Time logger for measuring execution time
   */
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },

  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  },

  /**
   * Trace logger for stack traces
   */
  trace: (...args: unknown[]) => {
    if (isDevelopment) {
      console.trace(...args);
    }
  },
};

export default logger;

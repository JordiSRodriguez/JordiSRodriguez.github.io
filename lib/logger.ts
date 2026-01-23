/**
 * Logger utility that only logs in development environment
 * Prevents console statements from appearing in production builds
 */

type LogLevel = "log" | "error" | "warn" | "info" | "debug";

const isDevelopment = process.env.NODE_ENV === "development";

const logger = {
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
};

/**
 * Group logger for grouping related console messages
 */
logger.group = (label: string) => {
  if (isDevelopment) {
    console.group(label);
  }
};

logger.groupCollapsed = (label: string) => {
  if (isDevelopment) {
    console.groupCollapsed(label);
  }
};

logger.groupEnd = () => {
  if (isDevelopment) {
    console.groupEnd();
  }
};

/**
 * Table logger for displaying tabular data
 */
logger.table = (data: unknown) => {
  if (isDevelopment) {
    console.table(data);
  }
};

/**
 * Time logger for measuring execution time
 */
logger.time = (label: string) => {
  if (isDevelopment) {
    console.time(label);
  }
};

logger.timeEnd = (label: string) => {
  if (isDevelopment) {
    console.timeEnd(label);
  }
};

/**
 * Trace logger for stack traces
 */
logger.trace = (...args: unknown[]) => {
  if (isDevelopment) {
    console.trace(...args);
  }
};

export default logger;

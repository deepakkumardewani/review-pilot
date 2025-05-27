const isDevelopment = process.env.NODE_ENV === "development";

const logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: (message: string, ...meta: any[]) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...(meta.length ? meta : []));
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (message: string, ...meta: any[]) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...(meta.length ? meta : []));
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (message: string, ...meta: any[]) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...(meta.length ? meta : []));
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (message: string, error?: any) => {
    if (error) {
      console.error(`[ERROR] ${message}`, error.message || error);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  },
};

export default logger;

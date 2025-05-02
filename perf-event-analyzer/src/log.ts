const DEBUG = false;

export function logIfDebug(log: 'error' | 'log', ...message: unknown[]) {
  if (DEBUG) {
    if (log === 'error') {
      console.error(message);
    } else {
      console.log(message);
    }
  }
}

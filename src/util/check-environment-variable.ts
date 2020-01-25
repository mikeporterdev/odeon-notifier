export function checkEnvironmentVariable(key: string): boolean {
  if (process.env[key]) {
    return true;
  }
  console.log(`Environment variable: ${key} not set`);
  return false;
}

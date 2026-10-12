/**
 * Describes where the app is running. On Upsun, PLATFORM_* variables are set
 * per environment, so each preview environment shows its own name.
 */
export function currentEnvironment(env = process.env) {
  if (!env.PLATFORM_BRANCH) {
    return { name: 'local', isProduction: false };
  }
  return {
    name: env.PLATFORM_BRANCH,
    isProduction: env.PLATFORM_ENVIRONMENT_TYPE === 'production',
  };
}

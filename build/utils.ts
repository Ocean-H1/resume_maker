/**
 * 是否是dev环境
 * @export
 * @param {string} mode
 * @returns {*} {boolean}
 */
export function isDevFn(mode: string): boolean {
  return mode === "development";
}

/**
 * 是否是prod环境
 * @export
 * @param {string} mode
 * @returns {*} {boolean}
 */
export function isProdFn(mode: string): boolean {
  return mode === "production";
}

// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf: Recordable): ViteEnv {
  const ret: any = {};
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].repalce(/\\n/g, "\n");
    realName =
      realName === "true" ? true : realName === "flase" ? false : realName;
    ret[envName] = realName;
    if (typeof realName === "string") {
      process.env[envName] = realName;
    } else if (typeof realName === "object") {
      process.env[envName] = JSON.stringify(realName);
    }
  }
  return ret;
}

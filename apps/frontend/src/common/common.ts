import { UserApis } from '../service/UserApis.ts';

export function getToken() {
  return localStorage.getItem('fcd-token');
}

export function setToken(token: string) {
  localStorage.setItem('fcd-token', token);
}

export function removeToken() {
  localStorage.removeItem('fcd-token');
}

export function getDefaultGameVersionFromLocalStorage() {
  const localGameVersion = localStorage.getItem('fcd-game-version');
  if (localGameVersion) {
    return parseInt(localGameVersion);
  } else {
    getDefaultGameVersion().then();
  }
}

export async function getDefaultGameVersion(): Promise<number> {
  const localGameVersion = localStorage.getItem('fcd-game-version');
  if (localGameVersion) {
    return parseInt(localGameVersion);
  }
  const userSetting = await UserApis.getUserSetting();
  const gameVersion = userSetting?.defaultGameVersion || 0;
  setDefaultGameVersion(gameVersion.toString());
  return userSetting?.defaultGameVersion || 0;
}

export function setDefaultGameVersion(gameVersion: string) {
  localStorage.setItem('fcd-game-version', gameVersion);
}

export function removeDefaultGameVersion() {
  localStorage.removeItem('fcd-game-version');
}

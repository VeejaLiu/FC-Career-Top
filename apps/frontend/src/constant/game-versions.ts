export const GAME_VERSIONS = [24, 25, 26, 27] as const;

export type GameVersion = (typeof GAME_VERSIONS)[number];

export function isGameVersion(value: number): value is GameVersion {
  return GAME_VERSIONS.some((version) => version === value);
}

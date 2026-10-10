import luaTemplate from '../../lua-scripts/client-script.lua?raw';
import { isGameVersion } from './game-versions';
import { getPlayerFeatures } from './player-features';

// Lua does not understand JSON's Unicode escapes. Keep Unicode text intact.
function luaString(value: string): string {
  const escaped = value.replace(/[\\"\x00-\x1f\x7f]/g, (character) => {
    if (character === '\\' || character === '"') return '\\' + character;
    return `\\${character.charCodeAt(0).toString().padStart(3, '0')}`;
  });
  return `"${escaped}"`;
}

export function createLuaScript(
  version: number,
  secretKey: string,
  uploadURL: string,
): string {
  if (!isGameVersion(version) || !secretKey) {
    throw new Error('Script configuration unavailable');
  }
  const url = new URL(uploadURL);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error('Invalid upload URL');
  }
  const values: Record<string, string> = {
    '{{game-version}}': String(version),
    '{{user-secret-key-lua}}': luaString(secretKey),
    '{{post-player-url-lua}}': luaString(uploadURL.replace(/\/+$/, '')),
    '{{playstyle-catalog-lua}}': `{\n${getPlayerFeatures(version)
      .map(
        (feature) =>
          `    { id = ${luaString(feature.id)}, group = ${feature.group}, bit = ${feature.bit}, kind = ${luaString(feature.kind)} },`,
      )
      .join('\n')}\n}`,
  };
  return luaTemplate.replace(
    /\{\{(?:game-version|user-secret-key-lua|post-player-url-lua|playstyle-catalog-lua)\}\}/g,
    (placeholder) => values[placeholder],
  );
}

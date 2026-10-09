import { getAvatarUrl } from '../common/player-helper';
import placeholder from '../assets/image/player_avatar_placeholder.svg';

export function PlayerAvatar({
  playerID,
  name,
  size = 48,
}: {
  playerID: number;
  name: string;
  size?: number;
}) {
  return (
    <img
      className="player-avatar"
      width={size}
      height={size}
      src={getAvatarUrl(playerID)}
      alt={name}
      loading="lazy"
      onError={(event) => {
        if (event.currentTarget.getAttribute('src') !== placeholder)
          event.currentTarget.src = placeholder;
      }}
    />
  );
}

import { useEffect, useMemo } from 'react';
import { Button, LocaleConsumer, Select } from '@douyinfe/semi-ui';
import { IconRefresh } from '@douyinfe/semi-icons';
import { PlayerApis } from '../../service/PlayerApis';
import { getColorByPositionType } from '../../common/player-helper';
import { comparePlayerPosition } from '../../common/player-sort';
import { MOBILE_QUERY, useMediaQuery } from '../../hooks/useMediaQuery';
import { useAsyncResource } from '../../hooks/useAsyncResource';

interface Props {
  playerID: number;
  setPlayerID: (id: number) => void;
}

export default function PlayerPickerComponent({
  playerID,
  setPlayerID,
}: Props) {
  const {
    data: players,
    loading,
    error,
    reload,
  } = useAsyncResource(PlayerApis.getPlayerList);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const sortedPlayers = useMemo(
    () => [...(players || [])].sort(comparePlayerPosition),
    [players],
  );
  useEffect(() => {
    if (!playerID && sortedPlayers.length)
      setPlayerID(sortedPlayers[0].playerID);
  }, [playerID, sortedPlayers, setPlayerID]);

  return (
    <LocaleConsumer componentName="PlayerDetailPage">
      {(locale: any) => (
        <div className="player-picker">
          {isMobile ? (
            <Select
              aria-label={locale.BasicInfo.PlayerName}
              placeholder={locale.BasicInfo.PlayerName}
              filter
              loading={loading}
              value={playerID || undefined}
              onChange={(value) => setPlayerID(Number(value))}
              optionList={sortedPlayers.map((player) => ({
                value: player.playerID,
                label: `${player.position1} · ${player.playerName} (#${player.playerID})`,
              }))}
            />
          ) : (
            <div className="player-picker-chips">
              {sortedPlayers.map((player) => (
                <button
                  type="button"
                  className={`player-picker-chip ${playerID === player.playerID ? 'selected' : ''}`}
                  key={player.playerID}
                  aria-pressed={playerID === player.playerID}
                  onClick={() => setPlayerID(player.playerID)}
                >
                  <span
                    style={{
                      color: getColorByPositionType(player.positionType),
                    }}
                  >
                    {player.position1}
                  </span>{' '}
                  {player.playerName}
                </button>
              ))}
            </div>
          )}
          <LocaleConsumer componentName="SettingsPage">
            {(settings: any) => (
              <Button
                icon={<IconRefresh />}
                aria-label={settings.Refresh}
                theme={error ? 'solid' : 'borderless'}
                loading={loading}
                onClick={reload}
              />
            )}
          </LocaleConsumer>
        </div>
      )}
    </LocaleConsumer>
  );
}

import React, { useEffect, useState } from 'react';
import { PlayerApis, PlayerOverall } from '../../service/PlayerApis.ts';
import { getColorByPositionType } from '../../common/player-helper.ts';
import { LoadingComponent } from '../../components/Other.tsx';
import { RefreshIcon } from '../../common/icons.tsx';

interface PlayerPickerComponentProps {
  playerID: number;
  setPlayerID: (id: number) => void;
}

const PlayerPickerComponent: React.FC<PlayerPickerComponentProps> = ({
  playerID,
  setPlayerID,
}) => {
  const [playerList, setPlayerList] = useState<PlayerOverall[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPlayerList = async () => {
    setIsLoading(true);
    const players: PlayerOverall[] = await PlayerApis.getPlayerList();
    setPlayerList(players);
    if (!playerID && players.length > 0) {
      setPlayerID(players[0].playerID);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPlayerList().then();
  }, []);

  const handlePlayerSelect = (id: number) => {
    setPlayerID(id);
  };

  return (
    <div className="flex sticky top-0 z-20 items-center min-h-12">
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div className="flex items-center w-full h-full bg-white">
          {/* Player list */}
          <div className="flex p-1 flex-wrap flex-grow">
            {playerList
              ?.sort((a: PlayerOverall, b: PlayerOverall) => {
                const positionTypeMap = {
                  GK: 1,
                  DEF: 2,
                  MID: 3,
                  FOR: 4,
                };
                return (
                  positionTypeMap[a.positionType] -
                    positionTypeMap[b.positionType] ||
                  a.position1.localeCompare(b.position1)
                );
              })
              .map((player: any) => {
                return (
                  <div
                    className={`inline-block
                     py-1 px-2 m-1
                     bg-gray-200 hover:bg-[#aaef88]
                     cursor-pointer whitespace-nowrap
                     border rounded-full
                     text-gray-500
                     ${player.playerID === playerID && 'bg-[#aaef88] border border-black text-black'}
                     `}
                    key={player.playerID}
                    onClick={() => handlePlayerSelect(player.playerID)}
                  >
                    <span
                      className="player-position font-bold mr-1"
                      style={{
                        color: getColorByPositionType(player.positionType),
                      }}
                    >
                      {player.position1}
                    </span>
                    <span>{player.playerName}</span>
                  </div>
                );
              })}
          </div>
          {/* Refresh button */}
          <div
            className="text-center items-center ml-auto mr-2 cursor-pointer text-green-900 p-2 rounded-full border hover:bg-gray-200"
            title="Click to refresh player list"
            onClick={() => {
              getPlayerList().then();
            }}
          >
            <RefreshIcon classname="h-6 w-6" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerPickerComponent;

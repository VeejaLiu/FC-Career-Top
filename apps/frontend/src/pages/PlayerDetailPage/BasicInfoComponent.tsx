import {
  getColorByOverallRating,
  getColorByPositionType,
  getWorkRateText,
} from '../../common/player-helper.ts';
import { PlayerAvatar } from '../../components/PlayerAvatar';
import {
  PLAYER_PRIMARY_POS_NAME,
  PLAYER_PRIMARY_POS_TYPE,
} from '../../constant/player.ts';
import { Space } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { getDefaultGameVersion } from '../../common/common.ts';
import './BasicInfoComponent.css';
import { StarIcon } from '../../common/icons.tsx';
import { PlayStylesComponent } from './PlayStylesComponent.tsx';
import { PlayerModel } from '../../service/PlayerApis.ts';

interface BasicInfoComponentProps {
  playerInfo: PlayerModel & {
    playStylesList: string[];
  };
  localeData: any;
}

const BasicInfoComponent: React.FC<BasicInfoComponentProps> = ({
  playerInfo,
  localeData,
}) => {
  const [gameVersion, setGameVersion] = useState<number>(0);
  const heightInInches = Math.round(playerInfo.height / 2.54);

  useEffect(() => {
    getDefaultGameVersion().then((version) => {
      setGameVersion(version);
    });
  }, []);

  return (
    <div className={'basic-info-container'}>
      <div className={'image-and-name'}>
        {/* Image */}
        <div className="w-32 h-32 m-auto">
          <PlayerAvatar
            playerID={playerInfo.player_id}
            name={playerInfo.player_name}
            size={128}
          />
        </div>
        {/* Name */}
        <div className="font-bold">{playerInfo?.player_name}</div>
        {/* Position */}
        <h1
          style={{
            color: getColorByPositionType(
              PLAYER_PRIMARY_POS_TYPE[playerInfo?.preferredposition1 || 0],
            ),
          }}
        >
          {PLAYER_PRIMARY_POS_NAME[playerInfo?.preferredposition1 || 0]}
        </h1>
        {/* Overall Rating -> Potential */}
        <Space style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          <span
            style={{
              color: getColorByOverallRating(playerInfo?.overallrating || 0),
            }}
          >
            {playerInfo?.overallrating}
          </span>
          {'→'}
          <span
            style={{
              color: getColorByOverallRating(playerInfo?.potential || 0),
            }}
          >
            {playerInfo?.potential}
          </span>
        </Space>
      </div>
      {/*Player ID*/}
      <div className="player-stat">
        <span className="stat-label">{localeData.BasicInfo.PlayerID}</span>
        <span className="stat-info-value">{playerInfo?.player_id}</span>
      </div>
      {/*Age*/}
      <div className="player-stat">
        <span className="stat-label">{localeData.BasicInfo.Age}</span>
        <span className="stat-info-value">{playerInfo?.age}</span>
      </div>
      {/*AcceleRATE	Controlled Explosive*/}
      {/*Skills*/}
      <div className="player-stat">
        <span className="stat-label">{localeData.BasicInfo.Skills}</span>
        <span className="stat-info-value flex">
          {/*{playerInfo?.skillmoves}*/}
          <span className={`font-bold text-yellow-400`}>
            {(playerInfo?.skillmoves || 0) + 1}
          </span>
          <StarIcon classname={'text-yellow-400'} />
        </span>
      </div>
      {/*Weak Foot*/}
      <div className="player-stat">
        <span className="stat-label">{localeData.BasicInfo.WeakFoot}:</span>
        <span className="stat-info-value flex">
          {/*{playerInfo?.weakfootabilitytypecode}*/}
          <span className={`font-bold text-yellow-400`}>
            {playerInfo?.weakfootabilitytypecode}
          </span>
          <StarIcon classname="text-yellow-400" />
        </span>
      </div>
      {/*Foot	Right*/}
      <div className="player-stat">
        <span className="stat-label">{localeData.BasicInfo.Foot}:</span>
        <span className="stat-info-value">
          {Number(playerInfo.preferredfoot) === 1 ? 'Right' : 'Left'}
        </span>
      </div>
      {/*Height	177cm | 5'10"*/}
      <div className="player-stat">
        <span className="stat-label">{localeData.BasicInfo.Height}:</span>
        <span className="stat-info-value">
          {playerInfo?.height}cm | {Math.floor(heightInInches / 12)}'{' '}
          {heightInInches % 12}"
        </span>
      </div>
      {/*Weight	67*/}
      <div className="player-stat">
        <span className="stat-label">{localeData.BasicInfo.Weight}:</span>
        <span className="stat-info-value">
          {playerInfo?.weight}kg | {Math.floor(playerInfo?.weight * 2.20462)}
          lbs
        </span>
      </div>
      {gameVersion === 24 && (
        <>
          {/*Att. WR	High*/}
          <div className="player-stat">
            <span className="stat-label">
              {localeData.BasicInfo.AttackingWorkRate}:
            </span>
            <span className="stat-info-value">
              {getWorkRateText(playerInfo?.attackingworkrate)}
            </span>
          </div>
          {/*Def. WR	High*/}
          <div className="player-stat">
            <span className="stat-label">
              {localeData.BasicInfo.DefensiveWorkRate}:
            </span>
            <span className="stat-info-value">
              {getWorkRateText(playerInfo?.defensiveworkrate)}
            </span>
          </div>
        </>
      )}
      {/* Play styles */}
      {Boolean(playerInfo?.playStylesList?.length) && (
        <div className="w-full text-center p-1 rounded-xl mt-2">
          {playerInfo?.playStylesList?.map(
            (playStyle: string, index: number) => (
              <PlayStylesComponent playStyle={playStyle} key={index} />
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default BasicInfoComponent;

import axios from 'axios';
import { BACKEND_URL } from '../constant';
import { Toast } from '@douyinfe/semi-ui';
import { getDefaultGameVersion, getToken } from '../common/common.ts';

export interface PlayerOverall {
  playerID: number;
  playerName: string;
  overallRating: number;
  potential: number;
  age: number;
  positionType: 'GK' | 'DEF' | 'MID' | 'FOR';
  position1: string;
  position2: string;
  position3: string;
  position4: string;
  imageUrl?: string;
  overallRanking?: number;
  potentialRanking?: number;
  skillMoves?: number;
  weakFootAbilityTypeCode?: number;
}

export interface PlayerTrend {
  inGameDate: string;
  overallRating: number;
  potential: number;
}

export interface PlayerTrendData {
  playerID: number;
  playerName: string;
  preferredposition1: string;
  positionType: string;
  trends: PlayerTrend[];
}

export interface PlayerModel {
  id: number;
  user_id: number;
  save_id: number;
  player_id: number;
  player_name: string;
  birthdate: number;
  age: number;
  overallrating: number;
  potential: number;
  nationality: string;
  height: number;
  weight: number;
  preferredfoot: string;
  preferredposition1: number;
  preferredposition2: number;
  preferredposition3: number;
  preferredposition4: number;
  skillmoves: number;
  weakfootabilitytypecode: number;
  attackingworkrate: number;
  defensiveworkrate: number;
  acceleration: number;
  sprintspeed: number;
  positioning: number;
  finishing: number;
  shotpower: number;
  longshots: number;
  volleys: number;
  penalties: number;
  vision: number;
  crossing: number;
  freekickaccuracy: number;
  shortpassing: number;
  longpassing: number;
  curve: number;
  agility: number;
  balance: number;
  reactions: number;
  ballcontrol: number;
  dribbling: number;
  composure: number;
  interceptions: number;
  headingaccuracy: number;
  defensiveawareness: number;
  standingtackle: number;
  slidingtackle: number;
  jumping: number;
  stamina: number;
  strength: number;
  aggression: number;
  gkdiving: number;
  gkhandling: number;
  gkkicking: number;
  gkpositioning: number;
  gkreflexes: number;
  play_styles: number;
  is_archived: number;
  is_deleted: boolean;
  create_time: Date;
  update_time: Date;
}

export interface PlayerDetail {
  thisPlayer: PlayerModel & {
    playStylesList: string[];
  };
  trends: PlayerTrend[];
}

export class PlayerApis {
  /**
   * Get player list
   */
  static async getPlayerList(): Promise<PlayerOverall[]> {
    try {
      const token = getToken();
      const gameVersion = await getDefaultGameVersion();
      // console.log(`[getPlayerList] token: ${token}`);
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/player/?gameVersion=${gameVersion}`,
        {
          headers: {
            Accept: '*/*',
            token: token,
          },
        },
      );
      if (response.status === 200) {
        return response.data;
      }
      return [];
    } catch (e: any) {
      console.log(`[getPlayerList] error code: ${e.response.status}`);
      console.log(`[getPlayerList] error message: ${e.message}`);
      if (e.response.status === 401) {
        Toast.error('Please login first');
      }
      return [];
    }
  }

  /**
   * Get player detail
   */
  static async getPlayerDetail({
    playerID,
  }: {
    playerID?: number;
  }): Promise<PlayerDetail | null> {
    try {
      const token = getToken();
      const gameVersion = await getDefaultGameVersion();
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/player/detail/${playerID || 0}?gameVersion=${gameVersion}`,
        {
          headers: {
            Accept: '*/*',
            token: token,
          },
        },
      );
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (e: any) {
      console.log(`[getPlayerDetail] error code: ${e.response.status}`);
      console.log(`[getPlayerDetail] error message: ${e.message}`);
      if (e.response.status === 401) {
        Toast.error('Please login first');
      }
      return null;
    }
  }

  /**
   * Get player count
   */
  static async getPlayerCount(): Promise<number> {
    try {
      const token = getToken();
      const gameVersion = await getDefaultGameVersion();
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/player/count?gameVersion=${gameVersion}`,
        {
          headers: { Accept: '*/*', token: token },
        },
      );
      if (response.status === 200) {
        return response.data;
      }
      return 0;
    } catch (e: any) {
      console.log(`[getPlayerCount] error code: ${e.response.status}`);
      console.log(`[getPlayerCount] error message: ${e.message}`);
      if (e.response.status === 401) {
        Toast.error('Please login first');
      }
      return 0;
    }
  }

  /**
   * Get player trends
   */
  static async getPlayerTrends(): Promise<PlayerTrendData[]> {
    try {
      const token = getToken();
      const gameVersion = await getDefaultGameVersion();
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/player/trends?gameVersion=${gameVersion}`,
        { headers: { Accept: '*/*', token: token } },
      );
      if (response.status === 200) {
        return response.data;
      }
      return [];
    } catch (e: any) {
      console.log(`[getPlayerCount] error code: ${e.response.status}`);
      console.log(`[getPlayerCount] error message: ${e.message}`);
      if (e.response.status === 401) {
        Toast.error('Please login first');
      }
      return [];
    }
  }
}

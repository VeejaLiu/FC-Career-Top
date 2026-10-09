import { useEffect } from 'react';
import {
  getToken,
  getDefaultGameVersionFromLocalStorage,
  removeToken,
} from '../common/common.ts';
import { getAvatarUrl, getColorByDiff } from '../common/player-helper.ts';
import { Notification } from '@douyinfe/semi-ui';
import { StarIcon } from '../common/icons.tsx';

/**
 * Send notification when player overall rating updated
 * @param payload
 */
function overratingChangeNotification(payload: any) {
  // {
  //     "playerID": 276839,
  //     "playerName": "Sebastiano Desplanches",
  //     "oldOverallrating": 1,
  //     "overallrating": 2,
  //     "oldPotential": 1,
  //     "potential": 2
  // }
  const {
    playerID,
    playerName,
    oldOverallrating,
    overallrating,
    oldPotential,
    potential,
  } = payload;
  Notification.open({
    content: (
      <div className="flex">
        {/* Avatar */}
        <div>
          <img className="h-20 w-20" src={getAvatarUrl(playerID)} alt="" />
        </div>

        {/* Notification */}
        <div className="ml-2">
          {/* Player name */}
          <div>
            <span className="font-bold"> {playerName}</span>
            <span className="text-gray-300 text-xs"> [ID: {playerID}]</span>
          </div>
          {/* Ovr / Pot */}
          <div className="flex mt-2 font-mono items-center">
            <div className="font-bold text-gray-400">Ovr</div>
            <div className="ml-4">{oldOverallrating}</div>
            <div className="w-10 text-center">{'→'}</div>
            <div
              style={{
                color: getColorByDiff(overallrating - oldOverallrating),
              }}
              className="font-bold text-xl"
            >
              {overallrating}
            </div>
          </div>
          <div className="flex mt-1 font-mono items-center">
            <div className="font-bold text-gray-400">Pot</div>
            <div className="ml-4">{oldPotential}</div>
            <div className="w-10 text-center">{'→'}</div>
            <div
              style={{ color: getColorByDiff(potential - oldPotential) }}
              className="font-bold text-xl"
            >
              {potential}
            </div>
          </div>
        </div>
      </div>
    ),
    duration: 5,
  });
}

function skillMoveChangeNotification(payload: any) {
  // {
  //     "playerID": 276839,
  //     "playerName": "Sebastiano Desplanches",
  //     "oldSkillMoves": 1,
  //     "skillmoves": 2
  // }
  const { playerID, playerName, oldSkillMoves, skillMoves } = payload;
  Notification.open({
    content: (
      <div className="flex">
        {/* Avatar */}
        <div>
          <img className="h-20 w-20" src={getAvatarUrl(playerID)} alt="" />
        </div>

        {/* Notification */}
        <div className="ml-2">
          {/* Player name */}
          <div>
            <span className="font-bold"> {playerName}</span>
            <span className="text-gray-300 text-xs"> [ID: {playerID}]</span>
          </div>
          {/* Ovr / Pot */}
          <div className="flex mt-2 font-mono items-center">
            <div className="font-bold text-gray-400">Skill moves</div>
            <div className="ml-4">{oldSkillMoves}</div>
            <StarIcon classname={'text-yellow-400 h-4'} />
            <div className="w-10 text-center">{'→'}</div>
            <div
              style={{
                color: getColorByDiff(skillMoves - oldSkillMoves),
              }}
              className="font-bold text-xl"
            >
              {skillMoves}
            </div>
            <StarIcon classname={'text-yellow-400 h-8'} />
          </div>
        </div>
      </div>
    ),
    duration: 5,
  });
}

function weakFootChangeNotification(payload: any) {
  // {
  //     "playerID": 276839,
  //     "playerName": "Sebastiano Desplanches",
  //     "oldWeakFootAbilityTypeCode": 1,
  //     "weakFootAbilityTypeCode": 2
  // }
  const {
    playerID,
    playerName,
    oldWeakFootAbilityTypeCode,
    weakFootAbilityTypeCode,
  } = payload;
  Notification.open({
    content: (
      <div className="flex">
        {/* Avatar */}
        <div>
          <img className="h-20 w-20" src={getAvatarUrl(playerID)} alt="" />
        </div>

        {/* Notification */}
        <div className="ml-2">
          {/* Player name */}
          <div>
            <span className="font-bold"> {playerName}</span>
            <span className="text-gray-300 text-xs"> [ID: {playerID}]</span>
          </div>
          {/* Ovr / Pot */}
          <div className="flex mt-2 font-mono items-center">
            <div className="font-bold text-gray-400">Weak foot</div>
            <div className="ml-4">{oldWeakFootAbilityTypeCode}</div>
            <StarIcon classname={'text-yellow-400 h-4'} />
            <div className="w-10 text-center">{'→'}</div>
            <div
              style={{
                color: getColorByDiff(
                  weakFootAbilityTypeCode - oldWeakFootAbilityTypeCode,
                ),
              }}
              className="font-bold text-xl"
            >
              {weakFootAbilityTypeCode}
            </div>
            <StarIcon classname={'text-yellow-400 h-8'} />
          </div>
        </div>
      </div>
    ),
    duration: 5,
  });
}

export const WebsocketNotification = () => {
  useEffect(() => {
    let stopped = false;
    let socket: WebSocket | undefined;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let delay = 1000;

    const connect = () => {
      const token = getToken();
      const address = import.meta.env.VITE_WS_URL;
      if (stopped || !token || !address) return;
      socket = new WebSocket(address, token);
      socket.onopen = () => {
        delay = 1000;
        heartbeat = setInterval(() => {
          if (socket?.readyState === WebSocket.OPEN) socket.send('ping');
        }, 30000);
      };
      socket.onmessage = (event) => {
        if (event.data === 'Session changed') {
          stopped = true;
          socket?.close(1000, 'Session changed');
          removeToken();
          window.location.assign('/');
          return;
        }
        if (event.data === 'pong' || event.data === 'Protocol accepted') return;
        try {
          const { type, payload } = JSON.parse(event.data);
          const version = getDefaultGameVersionFromLocalStorage();
          if (
            version &&
            payload.gameVersion &&
            Number(payload.gameVersion) !== version
          )
            return;
          if (type === 'PlayerUpdate.Overall')
            overratingChangeNotification(payload);
          else if (type === 'PlayerUpdate.SkillMove')
            skillMoveChangeNotification(payload);
          else if (type === 'PlayerUpdate.WeakFoot')
            weakFootChangeNotification(payload);
          window.dispatchEvent(new Event('fct-notifications-updated'));
        } catch {
          /* Ignore malformed or unrelated messages. */
        }
      };
      socket.onclose = (event) => {
        if (heartbeat) clearInterval(heartbeat);
        if (stopped) return;
        if (event.code === 1000 && event.reason === 'Session changed') {
          removeToken();
          window.location.assign('/');
          return;
        }
        retry = setTimeout(connect, delay);
        delay = Math.min(delay * 2, 10000);
      };
    };
    connect();
    return () => {
      stopped = true;
      if (retry) clearTimeout(retry);
      if (heartbeat) clearInterval(heartbeat);
      socket?.close(1000, 'Page closed');
    };
  }, []);
  return null;
};

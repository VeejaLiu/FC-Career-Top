import { useEffect } from 'react';
import { getToken } from '../common/common.ts';
import { getAvatarUrl, getColorByDiff } from '../common/player-helper.ts';
import { Notification } from '@douyinfe/semi-ui';
import { StarIcon } from '../common/icons.tsx';

let reconnectInterval = 1000; // Initial reconnect interval, 1 second
const maxReconnectInterval = 10 * 1000; // Maximum reconnect interval, 10 seconds

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
  async function createWebSocketConnection() {
    const token = getToken();
    if (!token) {
      console.log(
        'Cannot create WebSocket connection: token not found. And will retry in 5 seconds',
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return createWebSocketConnection();
    }

    // Create a new WebSocket connection
    const socket = new WebSocket(import.meta.env.VITE_WS_URL, token);

    // WebSocket connection established
    socket.onopen = () => {
      console.log('[WebSocket][onopen] connection established');
      // Send ping message every 10 seconds
      setInterval(() => {
        socket.send('ping');
      }, 30 * 1000);
    };

    // Handle incoming messages
    socket.onmessage = (event) => {
      const newNotification = event.data;
      console.log(
        '[WebSocket][onmessage] event.data=',
        JSON.stringify(newNotification),
      );

      if (!newNotification || newNotification === '') {
        console.log('Received empty message, ignore it');
        return;
      }

      if (newNotification === 'pong') {
        console.log('Received pong message, ignore it');
        return;
      }

      if (newNotification === 'Protocol accepted') {
        console.log('Received protocol accepted message, ignore it');
        return;
      }

      let type = '';
      let payload: any = {};
      try {
        const parsed = JSON.parse(newNotification);
        type = parsed.type;
        payload = parsed.payload;
      } catch (e) {
        console.error(
          '[WebSocket][onmessage] Failed to parse incoming message:',
          e,
        );
        return;
      }
      console.log('[WebSocket][onmessage] type:', type, 'payload:', payload);
      switch (type) {
        case 'PlayerUpdate.Overall': {
          overratingChangeNotification(payload);
          break;
        }
        case 'PlayerUpdate.SkillMove': {
          skillMoveChangeNotification(payload);
          break;
        }
        case 'PlayerUpdate.WeakFoot': {
          weakFootChangeNotification(payload);
          break;
        }
        default:
          console.log('Unknown message type:', type);
      }
    };

    // 连接关闭时的处理
    socket.onclose = () => {
      console.log(
        `[WebSocket][onclose] connection closed, will reconnect in ${reconnectInterval} ms`,
      );
      setTimeout(createWebSocketConnection, reconnectInterval);
      reconnectInterval = Math.min(2 * reconnectInterval, maxReconnectInterval);
    };
  }

  useEffect(() => {
    createWebSocketConnection().then(
      () => {
        console.log('WebSocket connection established');

        /*
         * Test code
         */
        // overratingChangeNotification({
        //   playerID: 276839,
        //   playerName: 'Sebastiano Desplanches',
        //   oldOverallrating: 89,
        //   overallrating: 90,
        //   oldPotential: 91,
        //   potential: 91,
        // });
        //
        // skillMoveChangeNotification({
        //   playerID: 276839,
        //   playerName: 'Sebastiano Desplanches',
        //   oldSkillMoves: 3,
        //   skillMoves: 4,
        // });
        //
        // weakFootChangeNotification({
        //   playerID: 276839,
        //   playerName: 'Sebastiano Desplanches',
        //   oldWeakFootAbilityTypeCode: 4,
        //   weakFootAbilityTypeCode: 5,
        // });
      },
      (err) => {
        console.error('Failed to establish WebSocket connection', err);
      },
    );
  }, []);

  return <></>;
};

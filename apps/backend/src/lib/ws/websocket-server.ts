import { Logger } from '../logger';
import { verifyToken } from '../token/verifyTokenMiddleware';
import WebSocket from 'ws';

const logger = new Logger(__filename);
const userConnections = new Map<number, WebSocket[]>(); // 存储用户连接

/**
 * Create a WebSocket server
 *
 * @param httpServer
 */
export function startWebSocketServer(httpServer) {
    const wss = new WebSocket.Server({ server: httpServer });

    wss.on('connection', async (socket, request) => {
        const token = request.headers['sec-websocket-protocol'];
        const verifyRes = await verifyToken(token);
        // logger.info('[ws.on_connection] verifyRes:', verifyRes);

        if (verifyRes.success) {
            const userId = verifyRes.data.id;
            const existingSockets = userConnections.get(userId) || [];
            if (existingSockets.length > 0) {
                // Close existing connections
                for (let i = 0; i < existingSockets.length; i++) {
                    existingSockets[i].close(1000, 'New connection established');
                }
            }
            userConnections.set(userId, [...existingSockets, socket]);
            socket.on('close', () => {
                userConnections.delete(userId);
            });

            // If received ping message, reply with pong
            socket.on('message', (message: any) => {
                // logger.info('[ws.on_connection] Received message:', message);
                const parsedMessage = typeof message === 'string' ? message : message.toString();
                // logger.info('[ws.on_connection] Parsed message:', parsedMessage);

                if (parsedMessage === 'ping') {
                    socket.send('pong');
                    // logger.info('[ws.on_connection] Sent pong message');
                }
            });

            // logger.info('[ws.on_connection] Protocol accepted');
            socket.send('Protocol accepted');
        } else {
            logger.error('[ws.on_connection] Protocol not supported');
            socket.close(1002, 'Protocol not supported');
        }
    });

    wss.on('error', (error: any) => {
        logger.error('[ws.on_error] Error:', error);
    });

    logger.info(`[ws.on_connection] WebSocket server started`);
}

interface WebsocketMessage {
    type: string;
    payload: any;
}

/**
 * Send message to specific user
 */
export function sendMessageToUser({ userId, message }: { userId: number; message: WebsocketMessage }) {
    try {
        const socket = userConnections.get(userId);

        if (socket && socket.length > 0) {
            // logger.info(`[sendMessageToUser] ${socket.length} socket(s) found for user ${userId}`);
            for (let i = 0; i < socket.length; i++) {
                const s = socket[i];
                s.send(JSON.stringify(message));
                // logger.info(`[sendMessageToUser][Socket-${i}] Message sent to user ${userId}`);
            }
        } else {
            // logger.error(`[sendMessageToUser] User ${userId} is not connected.`);
        }
    } catch (e) {
        logger.error('[sendMessageToUser] Error:', e);
    }
}

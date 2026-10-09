import express, { ErrorRequestHandler } from 'express';
import http from 'http';
import index from './router';
import { Logger } from './lib/logger';
import { banner } from './lib/banner';
import { loadMonitor } from './loaders/loadMonitor';
import { loadWinston } from './loaders/winstonLoader';
import { env } from './env';
import { closeSequelize } from './models/db-config-mysql';
import { startWebSocketServer } from './lib/ws/websocket-server';

const logger = new Logger(__filename);

async function Main() {
    const app = express();
    const server = http.createServer(app);

    // Fix CORS issue
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        next();
    });

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use('/api', index);

    loadMonitor(app);
    loadWinston();
    const log = new Logger(__filename);

    const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
        logger.error(`[APP][Error] ${err.stack}`);
        res.status(500).send('Something broke!');
    };
    app.use(errorHandler);

    startWebSocketServer(server);

    // Fix unhandled promise rejection
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception:', error);
    });

    // Catch unhandled promise rejection
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Close sequelize connection on SIGINT
    process.on('SIGINT', async () => {
        logger.info('SIGINT signal received.');
        await closeSequelize();
        process.exit();
    });

    server.listen(env.app.port, () => {
        banner(log);
    });
}

Main().then(() => {
    logger.info('Server started');
});

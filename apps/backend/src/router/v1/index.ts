import express from 'express';

const router = express.Router();

router.use('/player', require('./player').default);
router.use('/user', require('./user').default);
router.use('/notification', require('./notification').default);
router.use('/public', require('./public').default);

export default router;

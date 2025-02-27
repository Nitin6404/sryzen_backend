import { Router } from 'express';
import db from '../../database/models';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

export default router;
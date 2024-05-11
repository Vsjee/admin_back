import express, { Request, Response } from 'express';
import AdminsSchema from '../models/admin-model';

const adminRouter = express.Router();

/**
 * [GET] user admin validation
 */
adminRouter.get('/', async (req: Request, res: Response) => {
  const { userName } = req.query;
  const { password } = req.query;

  try {
    const user = await AdminsSchema.find({ user: userName });

    if (user.length === 0 || user[0].password! !== password)
      return res.json({ authorized: false });

    return res.json({ authorized: true });
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [POST] create user admin
 */
adminRouter.post('/create', (req: Request, res: Response) => {
  try {
    const user = AdminsSchema.create({
      user: 'bumii-admin',
      password: 'admin-pass-123',
      is_active: true,
      is_admin: true,
      modification_date: Date.now(),
    });

    res.json(user);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [PATCH] update user admin
 */
adminRouter.post('/create', (req: Request, res: Response) => {
  try {
    const user = AdminsSchema.create({
      user: 'bumii-admin',
      password: 'admin-pass-123',
      is_active: true,
      is_admin: true,
      modification_date: Date.now(),
    });

    res.json(user);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

export default adminRouter;

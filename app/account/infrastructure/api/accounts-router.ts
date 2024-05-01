import express, { Request, Response } from 'express';
import Accounts from '../models/accounts.model';

const accountsRouter = express.Router();

/**
 * [GET] bring all the accounts
 */
accountsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const account = await Accounts.find();
    res.json(account);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [POST] create a new account
 */
accountsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const account = await Accounts.create(req.body);
    res.json(account);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [GET] bring only one account by id
 */
accountsRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const account = await Accounts.findOne({ customer_id: id });
    res.json(account);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [PATCH] update account by id
 */
accountsRouter.patch('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const account = await Accounts.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(account);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [PATCH] update account state (is_active) by id
 */
accountsRouter.patch(
  '/update-account-state/:id',
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const type = req.query['type'];

    try {
      if (type !== undefined) {
        if (type === 'deactivate') {
          const account = await Accounts.findOneAndUpdate(
            { customer_id: id },
            {
              $set: {
                isActive: false,
              },
            }
          );

          res.json(account);
        }

        if (type === 'activate') {
          const account = await Accounts.findOneAndUpdate(
            { customer_id: id },
            {
              $set: {
                isActive: true,
              },
            }
          );

          res.json(account);
        }
      } else {
        res.json({ error: 'undefined query' });
      }
    } catch (error: any) {
      res.json({ error: error.message });
    }
  }
);

export default accountsRouter;

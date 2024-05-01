import express, { Request, Response } from 'express';
import Customers from '../models/customers.model';
import KidsSchema from '../../../kids/infrastructure/models/kids.model';

const customersRouter = express.Router();

/**
 * [GET] all the customers
 */
customersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const customers = await Customers.find();
    res.json(customers);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [GET] customer by firebase UID
 */
customersRouter.get('/uid/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const customer = await Customers.findOne({ uid: id });

    if (customer === null) {
      return res.json({
        fistName: '',
        lastName: '',
        cellphone: '',
        email: '',
        isActive: false,
        uid: '',
        creationDate: 0,
        modificationDate: 0,
      });
    }

    const kids = await KidsSchema.find({
      customer_id: customer.id,
      avatar: { $gte: ' ' },
    }).countDocuments();

    customer.kids_count = kids;

    res.json(customer);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [GET] customer by mongo ID
 */
customersRouter.get('/id/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const customer = await Customers.findById(id);

      if (customer !== null) {
        const kids = await KidsSchema.find({
          customer_id: customer.id,
          avatar: { $gte: ' ' },
        }).countDocuments();

        customer.kids_count = kids;

        res.json(customer);
      } else {
        res.json({
          fistName: '',
          lastName: '',
          cellphone: '',
          email: '',
          isActive: false,
          uid: '',
          creationDate: 0,
          modificationDate: 0,
        });
      }
    }
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [POST] create a new customer object
 */
customersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const emailCustomer = await Customers.findOne({
      $and: [{ email: req.body.email }, { cellphone: '' }, { isActive: true }],
    });

    const cellphoneCustomer = await Customers.findOne({
      $and: [
        { email: '' },
        { cellphone: req.body.cellphone },
        { isActive: true },
      ],
    });

    if (emailCustomer !== null) {
      return res.json(emailCustomer);
    } else if (cellphoneCustomer !== null) {
      return res.json(cellphoneCustomer);
    } else {
      const customer = await Customers.create(req.body);

      const kids = await KidsSchema.find({
        customer_id: customer.id,
        avatar: { $gte: ' ' },
      }).countDocuments();

      if (customer) {
        customer.kids_count = kids;
      }

      res.json(customer);
    }
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [PATCH] update customer by id
 */
customersRouter.patch('/id/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const customer = await Customers.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    const kids = await KidsSchema.find({
      customer_id: id,
      avatar: { $gte: ' ' },
    }).countDocuments();

    if (customer) {
      customer.kids_count = kids;
    }

    res.json(customer);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [PATCH] update customer state (is_active) by id
 */
customersRouter.patch(
  '/update-customer-state/:id',
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const type = req.query['type'];

    try {
      if (type !== undefined) {
        if (type === 'deactivate') {
          const customer = await Customers.findByIdAndUpdate(id, {
            $set: {
              isActive: false,
            },
          });

          res.json(customer);
        }

        if (type === 'activate') {
          const customer = await Customers.findByIdAndUpdate(id, {
            $set: {
              isActive: true,
            },
          });

          res.json(customer);
        }
      } else {
        res.json({ error: 'undefined query' });
      }
    } catch (error: any) {
      res.json({ error: error.message });
    }
  }
);

export default customersRouter;

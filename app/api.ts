import express from 'express';

import customersRouter from './customers/infrastructure/api/customers-router';
import kidsRouter from './kids/infrastructure/api/kids-router';
import booksRouter from './books/infrastructure/api/books-router';
import storiesRouter from './story/infraestructure/api/story-router';

const router = express.Router();

router.use('/customers', customersRouter);
router.use('/kids', kidsRouter);
router.use('/books', booksRouter);
router.use('/stories', storiesRouter);

export default router;

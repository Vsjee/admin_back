import express, { Response, Request } from 'express';
import BooksSchema from '../models/books.model';

const booksRouter = express.Router();

/**
 * [GET] books
 */
booksRouter.get('/', async (req: Request, res: Response) => {
  try {
    const books = await BooksSchema.find();
    res.json(books);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [GET] book by id
 */
booksRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const books = await BooksSchema.findById(id);
    res.json(books);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [PATCH] book by id
 */
booksRouter.patch('/patch/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const books = await BooksSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(books);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [DELETE] book by id
 */
booksRouter.delete('/delete/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const books = await BooksSchema.findByIdAndDelete(id);
    res.json(books);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

export default booksRouter;

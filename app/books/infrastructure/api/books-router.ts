import express, { Response, Request } from 'express';
import BooksSchema from '../models/books.model';

import StorySchema from '../../../story/infraestructure/models/story.model';

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
 * [GET] books by id
 */
booksRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const books = await BooksSchema.find({ customer_id: id });
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
    await StorySchema.findByIdAndDelete(books?.story_id);

    res.json({
      message: 'Book deleted successfully',
      status: 200,
    });
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

export default booksRouter;

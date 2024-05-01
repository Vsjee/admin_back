import express, { Request, Response } from 'express';
import StorySchema from '../models/story.model';

const storyRouter = express.Router();

/**
 * [GET] stories
 */
storyRouter.get('/', async (req: Request, res: Response) => {
  try {
    const books = await StorySchema.find();
    res.json(books);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [GET] stories by id
 */
storyRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const story = await StorySchema.find({ customer_id: id });
    res.json(story);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [PATCH] storie by id
 */
storyRouter.patch('/patch/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const books = await StorySchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(books);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [DELETE] storie by id
 */
storyRouter.delete('/delete/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const books = await StorySchema.findByIdAndDelete(id);
    res.json(books);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

export default storyRouter;

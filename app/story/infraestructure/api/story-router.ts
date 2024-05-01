import express, { Request, Response } from 'express';
import StorySchema from '../models/story.model';
import {
  translateFamilyContexts,
  translatePersonalContexts,
} from '../../../../utils/contexts_translate_util';

const storyRouter = express.Router();

storyRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const story = await StorySchema.findById(id);
    res.json(story);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

storyRouter.post('/', async (req: Request, res: Response) => {
  const type = req.query['type'];

  try {
    if (type === 'mobile') {
      let parsedFamilyContexts: string[] =
        req.body.characters[0].family_context;
      let parsedPersonalContexts: string[] =
        req.body.characters[0].personal_context;

      if (parsedFamilyContexts.length > 0) {
        req.body.characters[0].family_context =
          translateFamilyContexts(parsedFamilyContexts);
      }

      if (parsedPersonalContexts.length > 0) {
        req.body.characters[0].personal_context = translatePersonalContexts(
          parsedPersonalContexts
        );
      }

      const story = await StorySchema.create(req.body);

      const storyId = story.id;

      const findStory = await StorySchema.findById(storyId);

      res.json(findStory);
    } else {
      const story = await StorySchema.create(req.body);
      res.json(story);
    }
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

storyRouter.patch('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const story = await StorySchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(story);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

export default storyRouter;

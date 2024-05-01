import express, { Request, Response } from 'express';
import KidsSchema from '../models/kids.model';
import storyModel from '../../../story/infraestructure/models/story.model';
import booksModel from '../../../books/infrastructure/models/books.model';
import Utils from '../../../../utils/utils';

const kidsRouter = express.Router();

/**
 * [GET] kids
 */
kidsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const kids = await KidsSchema.find({
      avatar: { $gte: ' ' },
    });
    res.json(kids);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [GET] bring all the kids related to a customer
 */
kidsRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const kids = await KidsSchema.find({
      customer_id: id,
      avatar: { $gte: ' ' },
    });
    res.json(kids);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [GET] kid by customer id
 */
kidsRouter.get('/info/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const kids = await KidsSchema.findById(id);
    res.json(kids);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [GET] books info related to the kid by id
 */
kidsRouter.get('/books-info/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const utils = new Utils();
    let english_stories: number = 0;
    let french_stories: number = 0;
    let spanish_stories: number = 0;
    let portuguese_stories: number = 0;
    let empathy_included: number = 0;
    let compassion_included: number = 0;
    let gratitude_included: number = 0;
    let patience_included: number = 0;
    let confidence_included: number = 0;
    let adaptability_included: number = 0;
    let generosity_included: number = 0;
    let leadership_included: number = 0;
    let assertiveness_included: number = 0;

    const empathy_values = ['Empatia', 'Empathy', 'Empathie'];
    const compassion_values = ['Compasión', 'Compassion', 'Compaixão'];
    const gratitude_values = ['Gratitud', 'Gratitude', 'Gratidão'];
    const patience_values = ['Paciencia', 'Patience', 'Paciência'];
    const confidence_values = [
      'Confianza',
      'Confidence',
      'Confiance',
      'Confiança',
    ];
    const adaptability_values = [
      'Adaptabilidad',
      'Adaptability',
      'Adaptabilité',
      'Adaptabilidade',
    ];
    const generosity_values = [
      'Generosidad',
      'Generosity',
      'Générosité',
      'Generosidade',
    ];
    const leadership_values = ['Liderazgo', 'Leadership', 'Liderança'];
    const assertiveness_values = [
      'Asertividad',
      'Assertiveness',
      'Assertivité',
      'Assertividade',
    ];

    const kid = await KidsSchema.findById(id);
    const stories = await storyModel.find(
      { 'characters.kid_id': kid?.id },
      { _id: 1, lang: 1, characters: 1 }
    );

    let id_stories_created: Array<String> = stories.map((s) => s.id);
    const books = await booksModel.find({
      story_id: { $in: id_stories_created },
      is_story_approved: true,
    });
    let id_books_approved = books.map((b) => b.story_id);
    const stories_approved = stories.filter((story) =>
      id_books_approved.includes(String(story.id))
    );

    stories_approved.forEach((story) => {
      if (story.lang === 'EN') {
        english_stories += 1;
      }
      if (story.lang === 'ES') {
        spanish_stories += 1;
      }
      if (story.lang === 'FR') {
        french_stories += 1;
      }
      if (story.lang === 'BR') {
        portuguese_stories += 1;
      }
      if (story.characters[0].socioemotional_qualities) {
        if (
          utils.compareStringArrayElements(
            empathy_values,
            story.characters[0].socioemotional_qualities
          )
        ) {
          empathy_included += 1;
        }
        if (
          utils.compareStringArrayElements(
            compassion_values,
            story.characters[0].socioemotional_qualities
          )
        ) {
          compassion_included += 1;
        }
        if (
          utils.compareStringArrayElements(
            gratitude_values,
            story.characters[0].socioemotional_qualities
          )
        ) {
          gratitude_included += 1;
        }
        if (
          utils.compareStringArrayElements(
            patience_values,
            story.characters[0].socioemotional_qualities
          )
        ) {
          patience_included += 1;
        }
        if (
          utils.compareStringArrayElements(
            confidence_values,
            story.characters[0].socioemotional_qualities
          )
        ) {
          confidence_included += 1;
        }
        if (
          utils.compareStringArrayElements(
            adaptability_values,
            story.characters[0].socioemotional_qualities
          )
        ) {
          adaptability_included += 1;
        }
        if (
          utils.compareStringArrayElements(
            generosity_values,
            story.characters[0].socioemotional_qualities
          )
        ) {
          generosity_included += 1;
        }
        if (
          utils.compareStringArrayElements(
            leadership_values,
            story.characters[0].socioemotional_qualities
          )
        ) {
          leadership_included += 1;
        }
        if (
          utils.compareStringArrayElements(
            assertiveness_values,
            story.characters[0].socioemotional_qualities
          )
        ) {
          assertiveness_included += 1;
        }
      }
    });
    res.json({
      total_books: stories_approved.length,
      english_stories,
      french_stories,
      spanish_stories,
      portuguese_stories,
      empathy_included,
      compassion_included,
      gratitude_included,
      patience_included,
      confidence_included,
      adaptability_included,
      generosity_included,
      leadership_included,
      assertiveness_included,
    });
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [POST] create kid
 */
kidsRouter.post('/post', async (req: Request, res: Response) => {
  try {
    const kids = await KidsSchema.create(req.body);
    res.json(kids);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [DELETE] delete kid by id
 */
kidsRouter.delete('/delete/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const kid = await KidsSchema.findByIdAndDelete(id);
    res.json(kid);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [PATCH] update kid by id
 */
kidsRouter.patch('/patch/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const kid = await KidsSchema.findByIdAndUpdate(id, req.body, { new: true });
    res.json(kid);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

export default kidsRouter;

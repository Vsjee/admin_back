import express, { Request, Response } from 'express';
import KidsSchema from '../models/kids.model';
import storyModel from '../../../story/infraestructure/models/story.model';
import booksModel from '../../../books/infrastructure/models/books.model';
import Utils from '../../../../utils/utils';

const kidsRouter = express.Router();

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
 * [GET] bring the only one kid by his objectIds
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
 * [POST] create a new kid
 */
kidsRouter.post('/', async (req: Request, res: Response) => {
  const type = req.query['type'];

  try {
    if (type === 'mobile') {
      const kids = await KidsSchema.create(req.body);

      const kidId = kids.id;

      const findKid = await KidsSchema.findById(kidId);

      res.json(findKid);
    } else {
      const kids = await KidsSchema.create(req.body);
      res.json(kids);
    }
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

kidsRouter.post('/context', async (req: Request, res: Response) => {
  const valid_context_type: Array<string> = [
    'family',
    'personal',
    'socioemotional',
    'aspects',
    'personality',
  ];

  try {
    let payload = req.body;
    let _id: string = payload.hasOwnProperty('kid_id') ? payload.kid_id : null;
    let context_type: string = payload.hasOwnProperty('context_type')
      ? payload.context_type
      : null;
    let context: Array<string> = payload.hasOwnProperty('context')
      ? payload.context
      : null;
    let kid;

    if (_id === null || _id === '') {
      return res.status(400).send({ message: 'Kid Id is invalid' });
    }

    if (
      context_type === null ||
      context_type === '' ||
      !valid_context_type.includes(context_type)
    ) {
      return res.status(400).send({ message: 'Context type is invalid' });
    }

    if (context === null || context.length === 0) {
      return res.status(400).send({ message: 'Context is invalid' });
    }

    if (context_type === valid_context_type[0]) {
      kid = await KidsSchema.findByIdAndUpdate(
        { _id },
        { family_context: context, modification_date: Date.now() }
      );
    } else if (context_type === valid_context_type[1]) {
      kid = await KidsSchema.findByIdAndUpdate(
        { _id },
        { personal_context: context, modification_date: Date.now() }
      );
    } else if (context_type === valid_context_type[2]) {
      kid = await KidsSchema.findByIdAndUpdate(
        { _id },
        { socioemotional_context: context, modification_date: Date.now() }
      );
    } else if (context_type == valid_context_type[3]) {
      kid = await KidsSchema.findByIdAndUpdate(
        { _id },
        { aspects: context, modification_date: Date.now() }
      );
    } else if (context_type == valid_context_type[4]) {
      kid = await KidsSchema.findByIdAndUpdate(
        { _id },
        { personality: context, modification_date: Date.now() }
      );
    }

    res.json({ _id: kid?._id, customer_id: kid?.customer_id });
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

kidsRouter.delete('/:id', async (req: Request, res: Response) => {
  const { kidId } = req.params;

  try {
    const kid = await KidsSchema.findByIdAndDelete(kidId);
    res.json(kid);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

kidsRouter.post('/style', async (req: Request, res: Response) => {
  try {
    let payload = req.body;
    let _id: string = payload.hasOwnProperty('kid_id') ? payload.kid_id : null;
    let style_image: string = payload.hasOwnProperty('style_image')
      ? payload.style_image
      : null;
    let kid;

    if (_id === null || _id === '') {
      return res.status(400).send({ message: 'Kid Id is invalid' });
    }

    if (style_image === null || style_image === '') {
      return res.status(400).send({ message: 'Style image is invalid' });
    }

    kid = await KidsSchema.findByIdAndUpdate(
      { _id },
      { avatar: style_image, modification_date: Date.now() }
    );

    res.json({ _id: kid?._id, customer_id: kid?.customer_id });
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

/**
 * [PATCH] update only a kid by his objectId
 */
kidsRouter.patch('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const kid = await KidsSchema.findByIdAndUpdate(id, req.body, { new: true });
    res.json(kid);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

kidsRouter.patch(
  '/update-kids-status/:id',
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const type = req.query['type'];

    try {
      if (type !== undefined) {
        if (type === 'deactivate') {
          const kids = await KidsSchema.updateMany(
            {
              customer_id: id,
            },
            {
              $set: {
                is_active: false,
              },
            }
          );

          res.json(kids);
        }

        if (type === 'activate') {
          const kids = await KidsSchema.updateMany(
            {
              customer_id: id,
            },
            {
              $set: {
                is_active: true,
              },
            }
          );

          res.json(kids);
        }
      } else {
        res.json({ error: 'undefined query' });
      }
    } catch (error: any) {
      res.json({ error: error.message });
    }
  }
);

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

export default kidsRouter;

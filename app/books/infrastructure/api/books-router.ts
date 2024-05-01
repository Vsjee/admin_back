import express, { Response, Request } from 'express';
import BooksSchema from '../models/books.model';
import StorySchema from '../../../story/infraestructure/models/story.model';
import KidsSchema from '../../../kids/infrastructure/models/kids.model';

const booksRouter = express.Router();

booksRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const stories = await StorySchema.find({ customer_id: id });
    const kids = await KidsSchema.find({ customer_id: id });
    let books = await BooksSchema.find({ customer_id: id, is_active: true });

    let storyKids: Array<any> = [];
    stories.forEach((story) => {
      let kid = kids.filter(
        (k) => k._id.toString() === story.characters[0].kid_id
      )[0];
      storyKids.push({ story_id: story._id.toString(), kid_name: kid?.name });
    });

    let result: Array<any> = [];
    books.forEach((book) => {
      let kid = storyKids.filter((s) => s.story_id === book.story_id)[0];
      result.push({
        _id: book._id.toString(),
        customer_id: book.customer_id,
        story_id: book.story_id,
        is_story_approved: book.is_story_approved,
        is_active: book.is_active,
        creation_date: book.creation_date,
        modification_date: book.modification_date,
        story_text: book.story_text,
        story_title: book.story_title,
        story_audio_path: book.story_audio_path,
        kid_name: kid.kid_name,
        images: {
          main_action: book.images?.main_action,
          personality_main_character: book.images?.personality_main_character,
          description_main_setting: book.images?.description_main_setting,
          closure_story: book.images?.closure_story,
        },
        covers: {
          mini: book.covers?.mini,
          main: book.covers?.main,
        },
      });
    });

    res.json(result);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

booksRouter.get('/info/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const books = await BooksSchema.findById(id);
    res.json(books);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

booksRouter.patch('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const book = await BooksSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(book);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

booksRouter.patch(
  '/update-books-status/:id',
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const type = req.query['type'];

    try {
      if (type !== undefined) {
        if (type === 'deactivate') {
          const book = await BooksSchema.updateMany(
            {
              customer_id: id,
            },
            {
              $set: {
                is_active: false,
              },
            }
          );

          res.json(book);
        }

        if (type === 'activate') {
          const book = await BooksSchema.updateMany(
            {
              customer_id: id,
            },
            {
              $set: {
                is_active: true,
              },
            }
          );

          res.json(book);
        }
      } else {
        res.json({ error: 'undefined query' });
      }
    } catch (error: any) {
      res.json({ error: error.message });
    }
  }
);

booksRouter.patch('/review/:book', async (req: Request, res: Response) => {
  const bookId: string = req.params.book;
  let payload = req.body;
  let rating: number = payload.hasOwnProperty('rating') ? payload.rating : null;
  let feedback: string = payload.hasOwnProperty('feedback')
    ? payload.feedback
    : null;

  try {
    let review: any = {};

    if (rating !== null) {
      review.rating = rating;
    }

    if (feedback !== null && feedback !== '') {
      review.feedback = feedback;
    }

    if (Object.keys(review).length > 0) {
      const book = await BooksSchema.updateOne(
        { _id: bookId },
        { $set: { review: review, modification_date: Date.now() } }
      );
    }

    res.json({ message: 'Review saved', book_id: bookId });
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

booksRouter.get(
  '/:customerid/:quality',
  async (req: Request, res: Response) => {
    const { customerid, quality } = req.params;

    try {
      const stories = await StorySchema.find({ customer_id: customerid });
      let books = await BooksSchema.find({
        customer_id: customerid,
        is_active: true,
      });
      let storiesIdWithQuality: Array<any> = [];

      if (quality.toString().toLowerCase() === 'em') {
        stories.forEach((story) => {
          let storyWithQuality =
            story.characters[0].socioemotional_qualities?.find(
              (s) =>
                s.toString().toLowerCase() === 'empatia' ||
                s.toString().toLowerCase() === 'empathie' ||
                s.toString().toLowerCase() === 'empathy'
            );

          if (storyWithQuality) {
            storiesIdWithQuality.push(story._id.toString());
          }
        });
      }

      if (quality.toString().toLowerCase() === 'com') {
        stories.forEach((story) => {
          let storyWithQuality =
            story.characters[0].socioemotional_qualities?.find(
              (s) =>
                s.toString().toLowerCase() === 'compasión' ||
                s.toString().toLowerCase() === 'compassion' ||
                s.toString().toLowerCase() === 'compassion'
            );

          if (storyWithQuality) {
            storiesIdWithQuality.push(story._id.toString());
          }
        });
      }

      if (quality.toString().toLowerCase() === 'gr') {
        stories.forEach((story) => {
          let storyWithQuality =
            story.characters[0].socioemotional_qualities?.find(
              (s) =>
                s.toString().toLowerCase() === 'gratitud' ||
                s.toString().toLowerCase() === 'gratitude'
            );

          if (storyWithQuality) {
            storiesIdWithQuality.push(story._id.toString());
          }
        });
      }

      if (quality.toString().toLowerCase() === 'pa') {
        stories.forEach((story) => {
          let storyWithQuality =
            story.characters[0].socioemotional_qualities?.find(
              (s) =>
                s.toString().toLowerCase() === 'paciencia' ||
                s.toString().toLowerCase() === 'patience'
            );

          if (storyWithQuality) {
            storiesIdWithQuality.push(story._id.toString());
          }
        });
      }

      if (quality.toString().toLowerCase() === 'con') {
        stories.forEach((story) => {
          let storyWithQuality =
            story.characters[0].socioemotional_qualities?.find(
              (s) =>
                s.toString().toLowerCase() === 'confianza' ||
                s.toString().toLowerCase() === 'confiance' ||
                s.toString().toLowerCase() === 'confidence'
            );

          if (storyWithQuality) {
            storiesIdWithQuality.push(story._id.toString());
          }
        });
      }

      if (quality.toString().toLowerCase() === 'ada') {
        stories.forEach((story) => {
          let storyWithQuality =
            story.characters[0].socioemotional_qualities?.find(
              (s) =>
                s.toString().toLowerCase() === 'adaptabilidad' ||
                s.toString().toLowerCase() === 'adaptabilité' ||
                s.toString().toLowerCase() === 'adaptability'
            );

          if (storyWithQuality) {
            storiesIdWithQuality.push(story._id.toString());
          }
        });
      }

      if (quality.toString().toLowerCase() === 'gen') {
        stories.forEach((story) => {
          let storyWithQuality =
            story.characters[0].socioemotional_qualities?.find(
              (s) =>
                s.toString().toLowerCase() === 'generosidad' ||
                s.toString().toLowerCase() === 'générosité' ||
                s.toString().toLowerCase() === 'generosity'
            );

          if (storyWithQuality) {
            storiesIdWithQuality.push(story._id.toString());
          }
        });
      }

      if (quality.toString().toLowerCase() === 'le') {
        stories.forEach((story) => {
          let storyWithQuality =
            story.characters[0].socioemotional_qualities?.find(
              (s) =>
                s.toString().toLowerCase() === 'liderazgo' ||
                s.toString().toLowerCase() === 'leadership'
            );

          if (storyWithQuality) {
            storiesIdWithQuality.push(story._id.toString());
          }
        });
      }

      if (quality.toString().toLowerCase() === 'as') {
        stories.forEach((story) => {
          let storyWithQuality =
            story.characters[0].socioemotional_qualities?.find(
              (s) =>
                s.toString().toLowerCase() === 'asertividad' ||
                s.toString().toLowerCase() === 'assertivité' ||
                s.toString().toLowerCase() === 'assertiveness'
            );

          if (storyWithQuality) {
            storiesIdWithQuality.push(story._id.toString());
          }
        });
      }

      let payload = {
        msg: `Books filtered with socioemotional quality '${quality}' for customerId ${customerid}`,
        data: books.filter((book) =>
          storiesIdWithQuality.some((story) => story === book.story_id)
        ),
      };

      res.json(payload);
    } catch (error: any) {
      res.json({ error: error.message });
    }
  }
);

export default booksRouter;

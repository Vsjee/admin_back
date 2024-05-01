import { Schema, model } from 'mongoose';

const BooksSchema = new Schema({
  customer_id: String,
  story_id: String,
  is_story_approved: Boolean,
  is_active: Boolean,
  story_text: String,
  story_title: String,
  story_audio_path: String,
  image_prompts: String,
  creation_date: Number,
  modification_date: Number,
  is_public: Boolean,
  is_modified_by_user: Boolean,
  images: {
    main_action: String,
    personality_main_character: String,
    description_main_setting: String,
    closure_story: String,
  },
  review: {
    rating: {
      type: Number,
      default: undefined,
    },
    feedback: {
      type: String,
      default: undefined,
    },
  },
  covers: {
    mini: {
      type: String,
      default: undefined,
    },
    main: {
      type: String,
      default: undefined,
    },
  },
});

export default model('book', BooksSchema);

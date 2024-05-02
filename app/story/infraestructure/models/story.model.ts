import { Schema, model } from 'mongoose';

const CharacterSchema = new Schema(
  {
    kid_id: String,
    family_context: {
      type: Array,
      default: undefined,
    },
    personal_context: {
      type: Array,
      default: undefined,
    },
    socioemotional_context: {
      type: Array,
      default: undefined,
    },
    aspects: {
      type: Array,
      default: undefined,
    },
    socioemotional_qualities: {
      type: Array,
      default: undefined,
    },
  },
  { _id: false }
);

const IStoryTokens = new Schema(
  {
    prompt_tokens: Number,
    completion_tokens: Number,
    total_tokens: Number,
    source: String,
  },
  { _id: false }
);

const IImagesPromptTokens = new Schema(
  { prompt_tokens: Number, completion_tokens: Number, total_tokens: Number },
  { _id: false }
);

const StorySchema = new Schema(
  {
    customer_id: String,
    lang: String,
    characters: [CharacterSchema],
    main_plot: String,
    creation_date: Number,
    story_tokens: IStoryTokens,
    image_prompt_tokens: IImagesPromptTokens,
  },
  { _id: true }
);

export default model('story', StorySchema);

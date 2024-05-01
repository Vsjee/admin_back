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

const StorySchema = new Schema(
  {
    customer_id: String,
    lang: String,
    characters: [CharacterSchema],
    main_plot: String,
    creation_date: Number,
  },
  { _id: true }
);

export default model('story', StorySchema);

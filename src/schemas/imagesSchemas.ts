import joi from "joi";

export const imagesSchema = joi.object({
  url: joi.string().uri().trim().required(),
  moodboard_id: joi.number().integer().strict().required()
});

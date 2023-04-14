import joi from "joi";

export const cardsSchema = joi.object({
  title: joi.string().min(1).trim().required(),
  lane_id: joi.number().integer().strict().required()
});

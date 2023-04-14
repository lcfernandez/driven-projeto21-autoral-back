import joi from "joi";

export const lanesSchema = joi.object({
  title: joi.string().min(1).trim().required(),
  project_id: joi.number().integer().strict().required()
});

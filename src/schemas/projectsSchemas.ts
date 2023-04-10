import joi from "joi";

export const projectsSchema = joi.object({
  name: joi.string().min(1).trim().required()
});

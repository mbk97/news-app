import Joi from "joi";

export const validate = <T>(schema: Joi.ObjectSchema, data: T) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    return error.details[0].message;
  }
  return null;
};

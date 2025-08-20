import Joi from "joi";

export const validateQuizSubmission = (req, res, next) => {
  const schema = Joi.object({
    // userId removed – taken from req.user.id
    moduleId: Joi.string().required(), // slug or id
    answers: Joi.array()
      .items(
        Joi.object({
          questionId: Joi.string().required(),
          selectedIndex: Joi.number().min(0).required(),
        })
      )
      .min(1)
      .required(),
  });
  const { error } = schema.validate(req.body, { abortEarly: false });
  return error
    ? res
        .status(400)
        .json({ error: "Invalid quiz payload", details: error.details })
    : next();
};

export const validateProgressUpdate = (req, res, next) => {
  const schema = Joi.object({
    // userId removed – taken from req.user.id
    moduleId: Joi.string().required(), // slug or id
    progress: Joi.number().min(0).max(100).required(),
    timeSpentMin: Joi.number().min(0).default(0),
  });
  const { error } = schema.validate(req.body, { abortEarly: false });
  return error
    ? res
        .status(400)
        .json({ error: "Invalid progress payload", details: error.details })
    : next();
};

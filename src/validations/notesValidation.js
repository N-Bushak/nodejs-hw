import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// Схема для GET /notes (query параметри: сторінка, кількість, тег, пошук)
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().trim().allow(''),
  }),
};

// Схема для параметра noteId (використовується в GET/:id, DELETE/:id, і частково в PATCH/:id)
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

// Схема для POST /notes (тіло запиту)
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(...TAGS),
  }),
};

// Схема для PATCH /notes/:noteId (і параметр noteId, і тіло запиту в одній схемі)
export const updateNoteSchema = {
  [Segments.PARAMS]: noteIdSchema[Segments.PARAMS],
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(...TAGS),
  }).min(1), // хоча б одне поле має бути присутнім
};

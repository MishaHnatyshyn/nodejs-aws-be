import * as Joi from 'joi';
import {ProductDto} from '../types/product.dto';
import {createValidatorFunction} from '../../shared/utils/validation';

const productSchema = Joi.object({
  title: Joi.string().not().empty().required(),
  description: Joi.string().not().empty().required(),
  price: Joi.number().min(0).required(),
  count: Joi.number().min(0).required()
})

export const validateProductDto = createValidatorFunction<ProductDto>(productSchema)

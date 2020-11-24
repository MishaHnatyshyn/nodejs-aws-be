import {SQSHandler} from 'aws-lambda';
import {getBookService, getNotificationService} from '../services/utils';
import {ProductDto} from '../types/product.dto';
import {validateProductDto} from '../schemas/book.schema';
import * as Joi from 'joi';
import {NotificationStatus} from '../services/notification/notification.service';

const formatProductsData = (products): ProductDto[] => products.map((product) => {
  const {
    description,
    price,
    title,
    count,
  } = JSON.parse(product.body);
  return {
    description,
    price: Number(price),
    title,
    count: Number(count),
  }
})

const catalogBatchProcess: SQSHandler = async (event) => {
  const notificationService = await getNotificationService()
  try {
    const bookService = await getBookService()
    const { Records: products } = event;
    const formattedProducts: ProductDto[] = formatProductsData(products);

    formattedProducts.forEach((product) => {
      validateProductDto(product)
    })

    const books = await bookService.createMany(formattedProducts)

    await notificationService.notify('New products have been created', JSON.stringify(books))
  } catch (e) {
    if (e instanceof Joi.ValidationError) {
      await notificationService.notify(
        'Failed to create new products. Invalid product data',
        JSON.stringify(e.details),
        NotificationStatus.ERROR
      )
    }
    await notificationService.notify(
      'Failed to create new products. Internal error',
      e.toString(),
      NotificationStatus.ERROR
    )
  }
}

export default catalogBatchProcess;

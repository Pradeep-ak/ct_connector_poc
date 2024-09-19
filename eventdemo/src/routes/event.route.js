import { Router } from 'express';

import { eventHandler as productEventHandler } from '../controllers/product.event.controller.js';
import CustomError from '../errors/custom.error.js';
import { logger } from '../utils/logger.utils.js';
import { decodeToJson } from '../utils/decoder.utils.js';
import {
  HTTP_STATUS_SUCCESS_ACCEPTED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SUCCESS_NO_CONTENT,
} from '../constants/http.status.constants.js';

const eventRouter = Router();

async function eventHandler(request, response) {
  try {
    
    // const encodedMessageBody = request.body.message.data;
    // const messageBody = decodeToJson(encodedMessageBody);
    // const resourceType = messageBody?.resource?.typeId;
    await productEventHandler(request, response);
    
  } catch (err) {
    logger.error(err);
    if (err.statusCode) return response.status(err.statusCode).send(err);
    return response.status(500).send(err);
  }
}

eventRouter.post('/', eventHandler);

export default eventRouter;

import { decodeToJson } from '../utils/decoder.utils.js';
import { HTTP_STATUS_RESOURCE_CREATED } from '../constants/http.status.constants.js';
import { logger } from '../utils/logger.utils.js';
import { stringify } from 'querystring';


export const eventHandler = async (request, response) => {
  try {

    // Receive the Pub/Sub message
    try {
      logger.info("V3 Encoded body only stringyfy " + stringify(request.body));
      logger.info("V3 Logging request body  " + JSON.stringify(request.body));
    } catch (error) {
      logger.error(" Exception while printing logs at top level   ", error);
    }

    const encodedMessageBody = request.body.message.data;
    try {
      logger.info("V3 Encoded body only stringyfy " + stringify(encodedMessageBody));
      logger.info("V3 Encoded body  " + JSON.stringify(encodedMessageBody));
    } catch (error) {
      logger.error(" Exception while executing second level  ", error);
    }
    const messageBody = decodeToJson(encodedMessageBody);


    // var requestData = "Default Requst Data";
    // if(request && request.body) {
    //  logger.info(" Message body V2 ",request.body);
    //   requestData = stringify(request.body)
    //   logger.info(" Message Body Log v2 "+requestData);
    //   logger.info(" Message Body Log with parameterized",requestData);
    // }
    logger.info("V3 Logging message body" + stringify(messageBody));
    logger.info(" V3 logging JSON StringyFied request Body " + JSON.stringify(messageBody))
    if (messageBody) {
      const notificationType = messageBody.notificationType;
      const productId = messageBody.resource.id;

      logger.info(
        `sync product ${productId} with notification type ${notificationType}`
      );
    }
  } catch (error) {
    logger.error(" Exception while executing Highest level  ", error);
  }
  // Return the response for the client
  response.status(HTTP_STATUS_RESOURCE_CREATED).send("Event Received   :: " + JSON.stringify(request.body));
};

import { decodeToJson } from '../utils/decoder.utils.js';
import { HTTP_STATUS_RESOURCE_CREATED } from '../constants/http.status.constants.js';
import { logger } from '../utils/logger.utils.js';
import { stringify } from 'querystring';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const JWT_ISSUER = 'JWT_ISSUER';
const JWT_AUDIENCE = 'JWT_AUDIENCE';
const JWT_TTL_SECONDS = 'JWT_TTL_SECONDS';
const KAFKA_HOST = 'KAFKA_HOST';
const JWT_KEY = 'JWT_KEY';
const JWT_KEY_ID = 'JWT_KEY_ID';

export const eventHandler = async (request, response) => {
  try {

    const properties = new Map(Object.entries(process.env));

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
    const generateAccessToken = async () => {
      const private_key = properties.get(JWT_KEY)
      const jwtToken = jwt.sign({}, private_key, {
        algorithm: 'RS256',
        keyid: properties.get(JWT_KEY_ID),
        issuer: properties.get(JWT_ISSUER),
        subject: properties.get(JWT_ISSUER),
        audience: properties.get(JWT_AUDIENCE),
        expiresIn: Math.floor(Date.now() / 1000) + properties.get(JWT_TTL_SECONDS),
      });

      return jwtToken;
    };

    const jwtToken = await generateAccessToken();
    console.log(jwtToken)

    if (jwtToken) {
      const headers = {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/vnd.kafka.json.v2+json',
        'Accept': 'application/vnd.kafka.v2+json, application/vnd.kafka+json,application/json'
      };

      const kafkaHost = properties.get(KAFKA_HOST);
      const kafkaApiUrl = kafkaHost + '/topics/aso-digital-catalog-commercetools-category-dev3stage';

      // Make a POST request to the Kafka API to post the message
      const response = await axios.post(kafkaApiUrl, { message: 'Hello, Kafka!' }, { headers });

      console.log('Message posted successfully to Kafka.');
    }

  } catch (error) {
    logger.error(" Exception while executing Highest level  ", error);
  }
  // Return the response for the client
  response.status(HTTP_STATUS_RESOURCE_CREATED).send("Event Received   :: " + JSON.stringify(request.body));
};

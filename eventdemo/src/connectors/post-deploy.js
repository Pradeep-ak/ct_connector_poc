import { createApiRoot } from '../clients/create.client.js';
import { createChangedStoreSubscription } from './actions.js';
import { logger } from '../utils/logger.utils.js';
import { stringify } from 'querystring';

const CONNECT_GCP_TOPIC_NAME_KEY = 'CONNECT_GCP_TOPIC_NAME';
const CONNECT_GCP_PROJECT_ID_KEY = 'CONNECT_GCP_PROJECT_ID';

async function postDeploy(properties) {
  const topicName = properties.get(CONNECT_GCP_TOPIC_NAME_KEY);
  const projectId = properties.get(CONNECT_GCP_PROJECT_ID_KEY);

  const apiRoot = createApiRoot();
  await createChangedStoreSubscription(apiRoot, topicName, projectId);
}

async function run() {
  try {
    logger.info("CONNECT_GCP_TOPIC_NAME_KEY ::  "+CONNECT_GCP_TOPIC_NAME_KEY);
    logger.info("CONNECT_GCP_PROJECT_ID_KEY ::  "+CONNECT_GCP_PROJECT_ID_KEY);
    const properties = new Map(Object.entries(process.env));
    await postDeploy(properties);
  } catch (error) {
     logger.error(" Exception while executing post deploy  ",error);
    process.stderr.write(`Post-deploy failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}

run();

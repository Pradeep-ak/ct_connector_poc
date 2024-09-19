const CATEGORY_CHANGE_SUBSCRIPTION_KEY = 'ct_category_subscription';

export async function deleteChangedStoreSubscription(apiRoot) {
  const {
    body: { results: subscriptions },
  } = await apiRoot
    .subscriptions()
    .get({
      queryArgs: {
        where: `key = "${CATEGORY_CHANGE_SUBSCRIPTION_KEY}"`,
      },
    })
    .execute();

  if (subscriptions.length > 0) {
    const subscription = subscriptions[0];

    await apiRoot
      .subscriptions()
      .withKey({ key: CATEGORY_CHANGE_SUBSCRIPTION_KEY })
      .delete({
        queryArgs: {
          version: subscription.version,
        },
      })
      .execute();
  }
}

export async function createChangedStoreSubscription(
  apiRoot,
  topicName,
  projectId
) {
  await deleteChangedStoreSubscription(apiRoot);

  await apiRoot
    .subscriptions()
    .post({
      body: {
        key: CATEGORY_CHANGE_SUBSCRIPTION_KEY,
        destination: {
          type: 'GoogleCloudPubSub',
          topic: topicName,
          projectId:projectId,
        },
        changes: [
          {
            resourceTypeId: 'category',
            types: []
          }
        ]
      },
    })
    .execute();
}

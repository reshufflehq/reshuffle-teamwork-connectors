# reshuffle-teamwork-connectors

[Code](https://github.com/reshufflehq/reshuffle-teamwork-connectors) |
[npm](https://www.npmjs.com/package/reshuffle-teamwork-connectors) |
[Code sample](https://github.com/reshufflehq/reshuffle-teamwork-connectors/examples)

`npm install reshuffle-teamwork-connectors`

### Reshuffle Teamwork Connector

This package contains a [Reshuffle](https://github.com/reshufflehq/reshuffle)
connector to connect [Teamwork Online app APIs](https://github.com/moshie/teamwork-api).

The following example exposes an endpoint to return the data of a Task after an Update action.

```js
const { Reshuffle } = require('reshuffle')
const { TeamworkConnector } = require('reshuffle-teamwork-connectors')

const app = new Reshuffle()

const connector = new TeamworkConnector(app,  {
  apiKey: YOUR_API_KEY,
  subdomain: YOUR_SUB_DOMAIN,
  webhookPath: '/webhooks/teamwork'
})

connector.on({ type: 'TASK.UPDATED' }, async (event, app) => {
  console.log('TASK.UPDATED')
  console.log(event.eventCreator.id)
  console.log(event.taskList.name)
  console.log(event.task)
})

app.start()
```

### Table of Contents

[Configuration Options](#configuration)

#### Connector Events

[Listening to Teamwork events](#listen)

#### Connector Actions

[SDK](#sdk) - Retrieve a full Teamwork sdk object


### <a name="configuration"></a> Configuration options

```js
const app = new Reshuffle()
const connector = new TeamworkConnector(app, {
  apiKey: YOUR_API_KEY, 
  subdomain: YOUR_SUB_DOMAIN, 
  webhookPath: WEBHOOK_PATH 
})
```

- apiKey - How to find the [API key](https://developer.teamwork.com/projects/apikey/key)
- subdomain - https://[subdomain].teamwork.com/
- webhookPath - The path component of the Webhook Endpoint URI for this project. The default value is '/webhooks/teamwork'.


More details about the fields are described in [teamwork-api](https://github.com/moshie/teamwork-api)

You can use the `webhookPath` to configure the url that Teamwork hits when it makes its calls to.
For example - having the Reshuffle runtime URL `https://my-reshuffle.com` and `webhookPath='/webhook` will result in a complete webhook path of `https://my-reshuffle.com/webhook`.
If you do not provide a `webhookPath`, Reshuffle will use the default webhook path for the connector which is `/webhooks/teamwork`.
You will need to register this webhook with Teamwork. See [instructions](https://developer.teamwork.com/projects/webhooks/setup).


### <a name="events"></a> Events

#### <a name="listen"></a> Listening to Teamwork events

To listen to events happening in Teamwork, you'll need to capture them with the connector's `on`
function, providing a `TeamworkConnectorEventOptions` to it.


```typescript
interface TeamworkConnectorEventOptions {
  type: TWEventType // See bellow 
}

// Where...
type TWEventType =
  | 'CALENDAREVENT.CREATED'
  | 'CALENDAREVENT.DELETED'
  | 'CALENDAREVENT.REMINDER'
  | 'CALENDAREVENT.UPDATED'
  | 'CARD.CREATED'
  | 'CARD.DELETED'
  | 'CARD.UPDATED'
  | 'COLUMN.CREATED'
  | 'COLUMN.DELETED'
  | 'COLUMN.UPDATED'
  | 'COMMENT.CREATED'
  | 'COMMENT.DELETED'
  | 'COMMENT.UPDATED'
  | 'COMPANY.CREATED'
  | 'COMPANY.DELETED'
  | 'COMPANY.UPDATED'
  | 'EXPENSE.CREATED'
  | 'EXPENSE.DELETED'
  | 'EXPENSE.UPDATED'
  | 'FILE.CREATED'
  | 'FILE.DELETED'
  | 'FILE.DOWNLOADED'
  | 'FILE.TAGGED'
  | 'FILE.UNTAGGED'
  | 'FILE.UPDATED'
  | 'INVOICE.COMPLETED'
  | 'INVOICE.CREATED'
  | 'INVOICE.DELETED'
  | 'INVOICE.REOPENED'
  | 'INVOICE.UPDATED'
  | 'LINK.CREATED'
  | 'LINK.DELETED'
  | 'LINK.TAGGED'
  | 'LINK.UNTAGGED'
  | 'LINK.UPDATED'
  | 'MESSAGE.CREATED'
  | 'MESSAGE.DELETED'
  | 'MESSAGE.TAGGED'
  | 'MESSAGE.UNTAGGED'
  | 'MESSAGE.UPDATED'
  | 'MESSAGEREPLY.CREATED'
  | 'MESSAGEREPLY.DELETED'
  | 'MESSAGEREPLY.UPDATED'
  | 'MILESTONE.COMPLETED'
  | 'MILESTONE.CREATED'
  | 'MILESTONE.DELETED'
  | 'MILESTONE.REMINDER'
  | 'MILESTONE.REOPENED'
  | 'MILESTONE.TAGGED'
  | 'MILESTONE.UNTAGGED'
  | 'MILESTONE.UPDATED'
  | 'NOTEBOOK.CREATED'
  | 'NOTEBOOK.DELETED'
  | 'NOTEBOOK.TAGGED'
  | 'NOTEBOOK.UNTAGGED'
  | 'NOTEBOOK.UPDATED'
  | 'PORTFOLIOBOARD.CREATED'
  | 'PORTFOLIOBOARD.DELETED'
  | 'PORTFOLIOBOARD.UPDATED'
  | 'PORTFOLIOCARD.CREATED'
  | 'PORTFOLIOCARD.DELETED'
  | 'PORTFOLIOCARD.MOVED'
  | 'PORTFOLIOCARD.REOPENED'
  | 'PORTFOLIOCARD.UPDATED'
  | 'PORTFOLIOCOLUMN.CREATED'
  | 'PORTFOLIOCOLUMN.DELETED'
  | 'PORTFOLIOCOLUMN.UPDATED'
  | 'PROJECT.ARCHIVED'
  | 'PROJECT.COMPLETED'
  | 'PROJECT.COPIED'
  | 'PROJECT.CREATED'
  | 'PROJECT.DELETED'
  | 'PROJECT.REOPENED'
  | 'PROJECT.TAGGED'
  | 'PROJECT.UNTAGGED'
  | 'PROJECT.UPDATED'
  | 'PROJECTUPDATE.CREATED'
  | 'PROJECTUPDATE.DELETED'
  | 'PROJECTUPDATE.UPDATED'
  | 'RISK.CREATED'
  | 'RISK.DELETED'
  | 'RISK.UPDATED'
  | 'ROLE.CREATED'
  | 'ROLE.DELETED'
  | 'ROLE.UPDATED'
  | 'STATUS.CREATED'
  | 'STATUS.DELETED'
  | 'STATUS.UPDATED'
  | 'TASK.COMPLETED'
  | 'TASK.CREATED'
  | 'TASK.DELETED'
  | 'TASK.MOVED'
  | 'TASK.REMINDER'
  | 'TASK.REOPENED'
  | 'TASK.TAGGED'
  | 'TASK.UNTAGGED'
  | 'TASK.UPDATED'
  | 'TASKLIST.COMPLETED'
  | 'TASKLIST.CREATED'
  | 'TASKLIST.CREATEDFROMTEMPLATE'
  | 'TASKLIST.DELETED'
  | 'TASKLIST.REOPENED'
  | 'TASKLIST.UPDATED'
  | 'TIME.CREATED'
  | 'TIME.DELETED'
  | 'TIME.TAGGED'
  | 'TIME.UNTAGGED'
  | 'TIME.UPDATED'
  | 'USER.CREATED'
  | 'USER.DELETED'
  | 'USER.UPDATED'
```

Events require that an integration webhook is configured in Teamwork. 

The connector triggers events of many types, you can get more details about them [here](https://developer.teamwork.com/projects/api-v1/ref)


_Example:_

```typescript
connector.on({ type: 'TASK.UPDATED' }, async (event, app) => {
  console.log('TASK.UPDATED')
  console.log(event.eventCreator.id)
  console.log(event.taskList.name)
  console.log(event.task)
})
```

The description of fields and events can be found [here](https://developer.teamwork.com/projects/webhooks/events)

### <a name="actions"></a> Actions

The actions are provided via the [sdk](#sdk).

#### <a name="sdk"></a> sdk

Returns an object providing full access to the Teamwork APIs.
Full list of available actions, requests and responses can be found [here](https://developer.teamwork.com/projects/api-v1)

```typescript
const sdk = await connector.sdk()
```

_Example:_

```typescript
const sdk = await connector.sdk()
const taskLists = await sdk.tasklist.get()
console.log('Tasklists:', JSON.stringify(taskLists))
const task = await sdk.tasks.get({}, YOUR_TASK_ID))
console.log('Task YOUR_TASK_ID:', JSON.stringify(task))
```
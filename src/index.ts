import { Reshuffle, BaseHttpConnector, EventConfiguration } from 'reshuffle-base-connector'
import { Request, Response, NextFunction } from 'express'
import tw from 'teamwork-api'

const DEFAULT_WEBHOOK_PATH = '/webhooks/teamwork'

export interface TeamworkConnectorConfigOptions {
  apiKey: string
  subdomain: string
  webhookPath?: string
}

export interface TeamworkConnectorEventOptions {
  type: TeamworkEventType
}

export default class TeamworkConnector extends BaseHttpConnector<
  TeamworkConnectorConfigOptions,
  TeamworkConnectorEventOptions
> {
  private client: any
  private webhookPath = ''

  constructor(app: Reshuffle, options?: TeamworkConnectorConfigOptions, id?: string) {
    super(app, options, id)
    this.client = new tw(options?.apiKey, options?.subdomain)
    this.webhookPath = this.configOptions.webhookPath || DEFAULT_WEBHOOK_PATH
  }

  onStart(): void {
    if (Object.keys(this.eventConfigurations).length) {
      this.app.registerHTTPDelegate(this.webhookPath, this)
    }
  }

  // Your events
  on(options: TeamworkConnectorEventOptions, handler: any, eventId: string): EventConfiguration {
    if (!eventId) {
      eventId = `Teamwork/${options.type}/${this.id}`
    }
    const event = new EventConfiguration(eventId, this, options)
    this.eventConfigurations[event.id] = event

    this.app.when(event, handler)

    return event
  }

  async handle(req: Request, res: Response): Promise<boolean> {
    const eventType = req.headers['x-projects-event']
    const webhookPayload = req.body

    // TODO validate the payload with the signature hash
    const eventsToExecute = Object.values(this.eventConfigurations).filter(
      (e) => e.options.type === eventType,
    )
    for (const event of eventsToExecute) {
      await this.app.handleEvent(event.id, webhookPayload)
    }

    if (eventsToExecute.length == 0) {
      res.send({ text: 'Error' }).status(404)
    } else {
      res.sendStatus(200)
    }
    return true
  }

  // Actions
  async sdk() {
    return this.client
  }
}

export type TeamworkEventType =
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

export { TeamworkConnector }

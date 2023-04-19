import {
  EmitData,
  Subscriber,
  SubscriberContext,
  SubscriberDescriptor,
} from "./common"

export interface IEventBusModuleService {
  retrieveSubscribers(
    event: string | symbol
  ): SubscriberDescriptor[] | undefined

  emit<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown>
  ): Promise<void>
  emit<T>(data: EmitData<T>[]): Promise<void>

  subscribe(
    eventName: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this

  unsubscribe(
    eventName: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this
}

import BatchJobService from "../services/batch-job"
import EventBusService from "../services/event-bus"
import { StrategyResolverService } from "../services"
import { EntityManager } from "typeorm"

type InjectedDependencies = {
  eventBusService: EventBusService
  batchJobService: BatchJobService
  strategyResolverService: StrategyResolverService
  manager: EntityManager
}

class BatchJobSubscriber {
  private readonly eventBusService_: EventBusService
  private readonly batchJobService_: BatchJobService
  private readonly strategyResolver_: StrategyResolverService
  private readonly manager_: EntityManager

  constructor({
    eventBusService,
    batchJobService,
    strategyResolverService,
    manager,
  }: InjectedDependencies) {
    this.eventBusService_ = eventBusService
    this.batchJobService_ = batchJobService
    this.strategyResolver_ = strategyResolverService
    this.manager_ = manager

    this.eventBusService_
      .subscribe(BatchJobService.Events.CREATED, this.preProcessBatchJob)
      .subscribe(BatchJobService.Events.CONFIRMED, this.processBatchJob)
  }

  preProcessBatchJob = async (data): Promise<void> => {
    await this.manager_.transaction(async (manager) => {
      const batchJobServiceTx = this.batchJobService_.withTransaction(manager)
      const batchJob = await batchJobServiceTx.retrieve(data.id)

      const batchJobStrategy = this.strategyResolver_.resolveBatchJobByType(
        batchJob.type
      )

      try {
        await batchJobStrategy
          .withTransaction(manager)
          .preProcessBatchJob(batchJob.id)
        await batchJobServiceTx.setPreProcessingDone(batchJob.id)
      } catch (e) {
        await this.batchJobService_.setFailed(batchJob.id)
        throw e
      }
    })
  }

  processBatchJob = async (data): Promise<void> => {
    await this.manager_.transaction(async (manager) => {
      const batchJobServiceTx = this.batchJobService_.withTransaction(manager)
      const batchJob = await batchJobServiceTx.retrieve(data.id)

      const batchJobStrategy = this.strategyResolver_.resolveBatchJobByType(
        batchJob.type
      )

      await batchJobServiceTx.setProcessing(batchJob.id)

      try {
        await batchJobStrategy.withTransaction(manager).processJob(batchJob.id)
        await batchJobServiceTx.complete(batchJob.id)
      } catch (e) {
        await this.batchJobService_.setFailed(batchJob.id)
        throw e
      }
    })
  }
}

export default BatchJobSubscriber

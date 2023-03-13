import { EntityRepository, Repository } from "typeorm"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { StagedJob } from "../models"
import { rowSqlResultsToEntityTransformer } from "../utils"

@EntityRepository(StagedJob)
export class StagedJobRepository extends Repository<StagedJob> {
  async insertBulk(jobToCreates: QueryDeepPartialEntity<StagedJob>[]) {
    const queryBuilder = this.createQueryBuilder()
      .insert()
      .into(StagedJob)
      .values(jobToCreates)

    // TODO: remove if statement once this issue is resolved https://github.com/typeorm/typeorm/issues/9850
    if (!queryBuilder.connection.driver.isReturningSqlSupported("insert")) {
      const rawStagedJobs = await queryBuilder.execute()
      return rawStagedJobs.generatedMaps
    }

    const rawStagedJobs = await queryBuilder.returning("*").execute()

    return rowSqlResultsToEntityTransformer(
      rawStagedJobs.raw,
      queryBuilder,
      this.queryRunner!
    )
  }
}

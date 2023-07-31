import { SoftDeletableFilterKey } from "../dal"

export async function transactionWrapper<TManager = unknown>(
  this: any,
  task: (transactionManager: unknown) => Promise<any>,
  {
    transaction,
    isolationLevel,
    enableNestedTransactions = false,
  }: {
    isolationLevel?: string
    transaction?: TManager
    enableNestedTransactions?: boolean
  } = {}
): Promise<any> {
  // Reuse the same transaction if it is already provided and nested transactions are disabled
  if (!enableNestedTransactions && transaction) {
    return await task(transaction)
  }

  const options = {}

  if (transaction) {
    Object.assign(options, { ctx: transaction })
  }

  if (isolationLevel) {
    Object.assign(options, { isolationLevel })
  }

  const transactionMethod =
    this.manager_.transaction ?? this.manager_.transactional
  return await transactionMethod.bind(this.manager_)(task, options)
}

export const mikroOrmUpdateDeletedAtRecursively = async <
  T extends object = any
>(
  manager: any,
  entities: T[],
  value: Date | null
) => {
  for (const entity of entities) {
    if (!("deleted_at" in entity)) continue
    ;(entity as any).deleted_at = value

    const relations = manager
      .getDriver()
      .getMetadata()
      .get(entity.constructor.name).relations

    const relationsToCascade = relations.filter((relation) =>
      relation.cascade.includes("soft-remove" as any)
    )

    for (const relation of relationsToCascade) {
      let collectionRelation = entity[relation.name]

      if (!collectionRelation.isInitialized()) {
        await collectionRelation.init()
      }

      const relationEntities = await collectionRelation.getItems({
        filters: {
          [SoftDeletableFilterKey]: {
            withDeleted: true,
          },
        },
      })

      await mikroOrmUpdateDeletedAtRecursively(manager, relationEntities, value)
    }

    await manager.persist(entity)
  }
}

export const mikroOrmSerializer = async <TOutput extends object>(
  data: any,
  options?: any
): Promise<TOutput> => {
  options ??= {}
  const { serialize } = await import("@mikro-orm/core")
  const result = serialize(data, options)
  return result as unknown as Promise<TOutput>
}

export interface DatabaseSchema {
  version: string
  lastUpdated: Date
  collections: CollectionSchema[]
  indexes: IndexDefinition[]
  constraints: ConstraintDefinition[]
}


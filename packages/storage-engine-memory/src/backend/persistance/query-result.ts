import { IQueryResult } from '../../interfaces';

export class QueryResult implements IQueryResult {
  database: string;
  key?: string | undefined;
  collection?: string | undefined;
  value?: any;
  error?: string | undefined;
  status: 'error' | 'success';

  constructor(options: Partial<IQueryResult>) {
    this.database = options.database || '';
    this.collection = options.collection;
    this.value = options.value;
    this.error = options.error;
    this.status = options.status || 'success';
  }

  public setDatabase(database: string): QueryResult {
    this.database = database;
    return this;
  }

  public setCollection(collection: string): QueryResult {
    this.collection = collection;
    return this;
  }

  public setValue(value: any): QueryResult {
    this.value = value;
    return this;
  }

  public setError(error: string): QueryResult {
    this.error = error;
    return this;
  }

  public setStatus(status: 'success' | 'error'): QueryResult {
    this.status = status;
    return this;
  }
}

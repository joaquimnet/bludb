import ObjectId from 'bson-objectid';
import {
  CreateDatabaseCommand,
  DropDatabaseCommand,
  ShowDatabasesCommand,
  ShowCollectionsCommand,
  CreateCollectionCommand,
  DropCollectionCommand,
  ClearCollectionCommand,
  SelectCommand,
  InsertCommand,
  UpdateCommand,
  DeleteCommand,
} from '../../../compiler';
import { IPersistance } from '../../../interfaces';
import { QueryResult } from '../query-result';

export class MemoryPersistance implements IPersistance {
  private readonly databases: Map<string, Map<string, Map<string, any>>> = new Map();
  public _getDump() {
    return this.databases;
  }

  async createDatabase(cmd: CreateDatabaseCommand): Promise<QueryResult> {
    const result = new QueryResult({
      database: cmd.database,
    });

    if (this.databases.has(cmd.database)) {
      result.setError(`Database '${cmd.database}' already exists.`);
      result.setStatus('error');
      return result;
    }

    if (cmd.database?.length === 0) {
      result.setError('Database name cannot be empty.');
      result.setStatus('error');
      return result;
    }

    this.databases.set(cmd.database, new Map());
    result.setValue(cmd.database);
    return result;
  }

  async dropDatabase(cmd: DropDatabaseCommand): Promise<QueryResult> {
    const result = new QueryResult({
      database: cmd.database,
    });

    if (!this.databases.has(cmd.database)) {
      result.setError(`Database '${cmd.database}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    this.databases.delete(cmd.database);
    return result;
  }

  async showDatabases(cmd: ShowDatabasesCommand): Promise<QueryResult> {
    const result = new QueryResult({
      database: cmd.database,
    });

    const databases = Array.from(this.databases.keys());
    result.setValue(databases);
    return result;
  }

  async showCollections(cmd: ShowCollectionsCommand): Promise<QueryResult> {
    const result = new QueryResult({
      database: cmd.database,
    });

    if (!this.databases.has(cmd.database)) {
      result.setError(`Database '${cmd.database}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    const collections = Array.from(this.databases.get(cmd.database)!.keys());
    result.setValue(collections);
    return result;
  }

  async createCollection(cmd: CreateCollectionCommand): Promise<QueryResult> {
    const result = new QueryResult({
      database: cmd.database,
    });

    if (!this.databases.has(cmd.database)) {
      result.setError(`Database '${cmd.database}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    if (this.databases.get(cmd.database)!.has(cmd.collection)) {
      result.setError(`Collection '${cmd.collection}' already exists.`);
      result.setStatus('error');
      return result;
    }

    this.databases.get(cmd.database)!.set(cmd.collection, new Map());
    result.setValue(cmd.collection);
    return result;
  }

  async dropCollection(cmd: DropCollectionCommand): Promise<QueryResult> {
    const result = new QueryResult({
      database: cmd.database,
    });

    if (!this.databases.has(cmd.database)) {
      result.setError(`Database '${cmd.database}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    if (!this.databases.get(cmd.database)!.has(cmd.collection)) {
      result.setError(`Collection '${cmd.collection}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    this.databases.get(cmd.database)!.delete(cmd.collection);
    return result;
  }

  async clearCollection(cmd: ClearCollectionCommand): Promise<QueryResult> {
    const result = new QueryResult({
      database: cmd.database,
    });

    if (!this.databases.has(cmd.database)) {
      result.setError(`Database '${cmd.database}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    if (!this.databases.get(cmd.database)!.has(cmd.collection)) {
      result.setError(`Collection '${cmd.collection}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    this.databases.get(cmd.database)!.get(cmd.collection)!.clear();
    return result;
  }

  async select(cmd: SelectCommand): Promise<QueryResult> {
    const result = new QueryResult({
      database: cmd.database,
    });

    if (!this.databases.has(cmd.database)) {
      result.setError(`Database '${cmd.database}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    if (!this.databases.get(cmd.database)!.has(cmd.collection)) {
      result.setError(`Collection '${cmd.collection}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    const collection = this.databases.get(cmd.database)!.get(cmd.collection)!;
    let values = Array.from(collection.values());

    // filter values using filters from cmd.query
    if (cmd.query) {
      values = values.filter((value) => {
        let match = true;
        for (const key in cmd.query) {
          if (value[key] !== cmd.query[key]) {
            match = false;
            break;
          }
        }
        return match;
      });
    }

    result.setValue(values);
    return result;
  }

  async insert(cmd: InsertCommand): Promise<QueryResult> {
    const result = new QueryResult({
      database: cmd.database,
    });

    if (!this.databases.has(cmd.database)) {
      result.setError(`Database '${cmd.database}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    if (!this.databases.get(cmd.database)!.has(cmd.collection)) {
      result.setError(`Collection '${cmd.collection}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    const collection = this.databases.get(cmd.database)!.get(cmd.collection)!;
    const id = ObjectId().toHexString();
    collection.set(id, { id, ...cmd.value });
    result.setValue(id);
    return result;
  }

  async update(cmd: UpdateCommand): Promise<QueryResult> {
    const result = new QueryResult({
      database: cmd.database,
    });

    if (!this.databases.has(cmd.database)) {
      result.setError(`Database '${cmd.database}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    if (!this.databases.get(cmd.database)!.has(cmd.collection)) {
      result.setError(`Collection '${cmd.collection}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    const collection = this.databases.get(cmd.database)!.get(cmd.collection)!;
    let values = Array.from(collection.values());

    let updateCount = 0;

    if (cmd.query) {
      for (const record of values) {
        let match = true;
        for (const key in cmd.query) {
          if (record[key] !== cmd.query[key]) {
            match = false;
            break;
          }
        }
        if (match) {
          const newRecord = { ...record, ...cmd.value };
          updateCount++;
          collection.set(record.id, newRecord);
        }
      }
    }

    result.setValue(updateCount);
    return result;
  }

  async delete(cmd: DeleteCommand): Promise<QueryResult> {
    const result = new QueryResult({
      database: cmd.database,
    });

    if (!this.databases.has(cmd.database)) {
      result.setError(`Database '${cmd.database}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    if (!this.databases.get(cmd.database)!.has(cmd.collection)) {
      result.setError(`Collection '${cmd.collection}' does not exist.`);
      result.setStatus('error');
      return result;
    }

    const collection = this.databases.get(cmd.database)!.get(cmd.collection)!;
    let values = Array.from(collection.values());

    let deleteCount = 0;

    if (cmd.query) {
      for (const record of values) {
        let match = true;
        for (const key in cmd.query) {
          if (record[key] !== cmd.query[key]) {
            match = false;
            break;
          }
        }
        if (match) {
          deleteCount++;
          collection.delete(record.id);
        }
      }
    }

    result.setValue(deleteCount);
    return result;
  }
}

import { QueryResult } from './backend/persistance/query-result';
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
} from './compiler';
import { Command } from './compiler/commands/command';

export enum CommandType {
  CREATE_DATABASE = 'DB',
  DROP_DATABASE = 'DROP_DB',
  USE_DATABASE = 'USE',
  SHOW_DATABASES = 'DATABASES',
  SHOW_COLLECTIONS = 'COLLECTIONS',

  CREATE_COLLECTION = 'COL',
  DROP_COLLECTION = 'DROP_COL',
  CLEAR_COLLECTION = 'CLEAR_COL',
  INSERT = 'INSERT',
  SELECT = 'SELECT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',

  UNKNOWN = 'UNKNOWN',
}

export enum MetaCommandType {
  EXIT = 'EXIT',
  HELP = 'HELP',
  DUMP = 'DUMP',
  UNKNOWN = 'UNKNOWN',
}

export interface ICommand {}

export interface IPersistance {
  createDatabase(cmd: CreateDatabaseCommand): Promise<QueryResult>;
  dropDatabase(cmd: DropDatabaseCommand): Promise<QueryResult>;
  showDatabases(cmd: ShowDatabasesCommand): Promise<QueryResult>;
  showCollections(cmd: ShowCollectionsCommand): Promise<QueryResult>;
  createCollection(cmd: CreateCollectionCommand): Promise<QueryResult>;
  dropCollection(cmd: DropCollectionCommand): Promise<QueryResult>;
  clearCollection(cmd: ClearCollectionCommand): Promise<QueryResult>;

  select: (cmd: SelectCommand) => Promise<QueryResult>;
  insert: (cmd: InsertCommand) => Promise<QueryResult>;
  update: (cmd: UpdateCommand) => Promise<QueryResult>;
  delete: (cmd: DeleteCommand) => Promise<QueryResult>;
}

export interface IQueryResult {
  database: string;
  key?: string;
  collection?: string;
  value?: any;
  error?: string;
  status: 'success' | 'error';
}

export type CollectionRecord = Record<string, any>;

export interface IQuery {
  database?: string;
  collection?: string;
  command?: Command;
}

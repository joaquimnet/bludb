import { CommandType, ICommand } from '../../interfaces';
import { Command } from './command';

export class CreateCollectionCommand extends Command implements ICommand {
  static readonly type = CommandType.CREATE_COLLECTION;
  database: string;
  collection: string;

  constructor(database: string, collection: string) {
    super();
    this.database = database;
    this.collection = collection;
  }
}

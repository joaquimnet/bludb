import { CommandType, ICommand } from '../../interfaces';
import { Command } from './command';

export class DropCollectionCommand extends Command implements ICommand {
  static readonly type = CommandType.DROP_COLLECTION;
  database: string;
  collection: string;

  constructor(database: string, collection: string) {
    super();
    this.database = database;
    this.collection = collection;
  }
}

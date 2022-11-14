import { CommandType, ICommand } from '../../interfaces';
import { Command } from './command';

export class ShowCollectionsCommand extends Command implements ICommand {
  static readonly type = CommandType.SHOW_COLLECTIONS;
  database: string;

  constructor(database: string) {
    super();
    this.database = database;
  }
}

import { CommandType, ICommand } from '../../interfaces';
import { Command } from './command';

export class DropDatabaseCommand extends Command implements ICommand {
  static readonly type = CommandType.DROP_DATABASE;
  database: string;

  constructor(database: string) {
    super();
    this.database = database;
  }
}

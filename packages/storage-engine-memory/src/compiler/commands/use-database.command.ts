import { CommandType, ICommand } from '../../interfaces';
import { Command } from './command';

export class UseDatabaseCommand extends Command implements ICommand {
  static readonly type = CommandType.USE_DATABASE;
  database: string;

  constructor(database: string) {
    super();
    this.database = database;
  }
}

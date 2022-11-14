import { CommandType, ICommand } from '../../interfaces';
import { Command } from './command';

export class CreateDatabaseCommand extends Command implements ICommand {
  static readonly type = CommandType.CREATE_DATABASE;
  database: string;

  constructor(database: string = '') {
    super();
    this.database = database;
  }
}

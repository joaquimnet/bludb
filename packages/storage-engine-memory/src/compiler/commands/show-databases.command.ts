import { CommandType, ICommand } from '../../interfaces';
import { Command } from './command';

export class ShowDatabasesCommand extends Command implements ICommand {
  static readonly type = CommandType.SHOW_DATABASES;
  database: string;

  constructor() {
    super();
    this.database = '';
  }
}

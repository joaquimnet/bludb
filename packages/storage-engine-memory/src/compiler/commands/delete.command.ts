import { CommandType, ICommand } from '../../interfaces';
import { Command } from './command';

export class DeleteCommand extends Command implements ICommand {
  static readonly type = CommandType.DELETE;

  constructor(
    public readonly database: string,
    public readonly collection: string,
    public readonly query: Record<string, any>,
  ) {
    super();
  }
}

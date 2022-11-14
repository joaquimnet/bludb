import { CommandType, ICommand } from '../../interfaces';
import { Command } from './command';

export class SelectCommand extends Command implements ICommand {
  static readonly type = CommandType.SELECT;

  constructor(
    public readonly database: string,
    public readonly collection: string,
    public readonly query: Record<string, any>,
  ) {
    super();
  }
}

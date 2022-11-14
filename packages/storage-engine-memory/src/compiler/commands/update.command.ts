import { CollectionRecord, CommandType, ICommand } from '../../interfaces';
import { Command } from './command';

export class UpdateCommand extends Command implements ICommand {
  static readonly type = CommandType.UPDATE;

  constructor(
    public readonly database: string,
    public readonly collection: string,
    public readonly value: CollectionRecord,
    public readonly query: Record<string, any>,
  ) {
    super();
  }
}

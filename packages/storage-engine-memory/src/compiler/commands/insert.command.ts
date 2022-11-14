import { CollectionRecord, CommandType, ICommand } from '../../interfaces';
import { Command } from './command';

export class InsertCommand extends Command implements ICommand {
  static readonly type = CommandType.INSERT;

  constructor(
    public readonly database: string,
    public readonly collection: string,
    public readonly value: CollectionRecord,
  ) {
    super();
  }
}

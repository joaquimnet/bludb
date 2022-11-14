import readline from 'node:readline/promises';
import process from 'process';
import { CommandType, IPersistance, MetaCommandType } from '../interfaces';
import * as commands from '../compiler';
import { MemoryPersistance } from '../backend/persistance/engines/memory';

const metaCommandTypes = Object.values(MetaCommandType);
const commandTypes = Object.values(CommandType);

export class REPL {
  private executionContext: {
    database?: string;
    persistance: IPersistance;
  };

  constructor() {
    this.executionContext = {
      persistance: new MemoryPersistance(),
    };
    this.start();
  }

  private async start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
      const input = await rl.question(`${this.executionContext.database ?? ''}>> `);
      const metaCommand = this.parseMetaCommand(input);
      if (metaCommand) {
        this.runMetaCommand(metaCommand as MetaCommandType);
      }

      const [command, args] = this.parseCommand(input);
      const commandArgs = [];

      if (command) {
        if (command.type === CommandType.USE_DATABASE) {
          this.executionContext.database = args[0];
        }
        if (command.type !== CommandType.CREATE_DATABASE) {
          if (this.executionContext.database) {
            commandArgs.unshift(this.executionContext.database);
          }
        }

        args.forEach((arg, i) => {
          let parsedJson;
          if (i > 0) {
            try {
              parsedJson = JSON.parse(arg);
            } catch (err: any) {
              parsedJson = {
                _error: err.message,
                _value: arg,
              };
            }
          }
          commandArgs.push(parsedJson ?? arg);
        });
        // console.log('args: ', args);
        // console.log('commandArgs: ', commandArgs);

        await this.runCommand(new command(...commandArgs));

        if (command.type === CommandType.CREATE_DATABASE) {
          this.executionContext.database = args[0];
        }
      }
    }
  }

  private parseCommand(input: string): [any | null, string[]] {
    const parts = input.split(/ +/);

    const cmd = parts[0]?.toUpperCase();

    if (!commandTypes.includes(cmd as CommandType)) {
      return [null, []];
    }

    const command = this.findCommand(cmd as CommandType);

    if (!command) {
      return [null, []];
    }

    const args = parts.slice(1);

    return [command, args];
  }

  private findCommand(cmd: CommandType) {
    return Object.values(commands).find((command: any) => command?.type === cmd);
  }

  private async runCommand(command: any) {
    let result;
    switch (command.constructor.type) {
      case CommandType.CREATE_DATABASE: {
        result = await this.executionContext.persistance.createDatabase(command);
        break;
      }
      case CommandType.DROP_DATABASE: {
        result = await this.executionContext.persistance.dropDatabase(command);
        break;
      }
      case CommandType.SHOW_DATABASES: {
        result = await this.executionContext.persistance.showDatabases(command);
        break;
      }
      case CommandType.SHOW_COLLECTIONS: {
        result = await this.executionContext.persistance.showCollections(command);
        break;
      }
      case CommandType.CREATE_COLLECTION: {
        result = await this.executionContext.persistance.createCollection(command);
        break;
      }
      case CommandType.DROP_COLLECTION: {
        result = await this.executionContext.persistance.dropCollection(command);
        break;
      }
      case CommandType.CLEAR_COLLECTION: {
        result = await this.executionContext.persistance.clearCollection(command);
        break;
      }
      case CommandType.INSERT: {
        result = await this.executionContext.persistance.insert(command);
        break;
      }
      case CommandType.SELECT: {
        result = await this.executionContext.persistance.select(command);
        break;
      }
      case CommandType.UPDATE: {
        result = await this.executionContext.persistance.update(command);
        break;
      }
      case CommandType.DELETE: {
        result = await this.executionContext.persistance.delete(command);
        break;
      }
      default: {
        break;
      }
    }
    result && console.log(`${result.status} |`, result.error ?? result.value);
  }

  private parseMetaCommand(input: string): MetaCommandType | null {
    if (!input.startsWith('.')) {
      return null;
    }
    if (metaCommandTypes.includes(input.slice(1).toUpperCase() as MetaCommandType)) {
      return input.slice(1).toUpperCase() as MetaCommandType;
    }
    return null;
  }

  private runMetaCommand(command: MetaCommandType) {
    switch (command) {
      case MetaCommandType.EXIT: {
        process.exit(0);
      }
      case MetaCommandType.HELP: {
        console.log('Help');
        break;
      }
      case MetaCommandType.DUMP: {
        console.log((this.executionContext.persistance as any)._getDump());
        break;
      }
      case MetaCommandType.UNKNOWN: {
        console.log('Unknown command');
        break;
      }
    }
  }
}

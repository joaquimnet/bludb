import { REPL } from './interface/repl';
import packageJson from '../package.json';

console.log(`Blu REPL v${packageJson.version}`);
const repl = new REPL();
repl;

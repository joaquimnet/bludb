type JsonObject = { [key: string]: JsonObject };
type Argv = string[];
type JsonObjects = JsonObject[];
type ParsedLine = [Argv, JsonObjects];

export const myEpicJsonRegex = /(\{|\[).+?(\}|\])(?=( +|$))/g;
export const myEpicArgvRegex = /^[a-zA-Z\-\_0-9]+$/i;

export function lineParser(line: string): ParsedLine {
  const jsons = line.match(myEpicJsonRegex) || [];
  const argv = line
    .replace(myEpicJsonRegex, '')
    .trim()
    .split(/ +/g)
    .filter((s) => myEpicArgvRegex.test(s));
  const parsedJsons = jsons.map(tryParseJson);
  return [argv, parsedJsons];
}

function tryParseJson(json: string): JsonObject {
  try {
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
}

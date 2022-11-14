import { lineParser } from './line-parser';

describe('REPL', () => {
  describe('Line Parser', () => {
    test('should parse positional args', () => {
      const input = 'foo bar baz';
      const expected = [['foo', 'bar', 'baz'], []];
      expect(lineParser(input)).toEqual(expected);
    });

    test('should parse positional args with json', () => {
      const input = 'foo { "bar": "baz" }';
      const expected = [['foo'], [{ bar: 'baz' }]];
      expect(lineParser(input)).toEqual(expected);
    });

    test('should parse positional args with multiple json', () => {
      const input = 'foo { "bar": "baz" } { "hello": "world" }';
      const expected = [['foo'], [{ bar: 'baz' }, { hello: 'world' }]];
      expect(lineParser(input)).toEqual(expected);
    });

    test('should parse positional args with multiple json and spaces', () => {
      const input = 'foo { "bar": "baz" } { "hello": "world" }   ';
      const expected = [['foo'], [{ bar: 'baz' }, { hello: 'world' }]];
      expect(lineParser(input)).toEqual(expected);

      const input2 = '   foo { "bar":      "baz"  }    { "hello": "world" }   ';
      const expected2 = [['foo'], [{ bar: 'baz' }, { hello: 'world' }]];
      expect(lineParser(input2)).toEqual(expected2);
    });

    test('should parse positional args with multiple json and spaces and args', () => {
      const input = 'foo { "bar": "baz" } { "hello": "world" }   bar';
      const expected = [
        ['foo', 'bar'],
        [{ bar: 'baz' }, { hello: 'world' }],
      ];
      expect(lineParser(input)).toEqual(expected);

      const input2 = '   foo { "bar":      "baz"  }    { "hello": "world" }   bar';
      const expected2 = [
        ['foo', 'bar'],
        [{ bar: 'baz' }, { hello: 'world' }],
      ];
      expect(lineParser(input2)).toEqual(expected2);
    });

    test('should parse args and return empty object if json is invalid', () => {
      const input = 'foo { "bar": "baz" } { "hello": "world" } { "foo": "bar }';
      const expected = [['foo'], [{ bar: 'baz' }, { hello: 'world' }, {}]];
      expect(lineParser(input)).toEqual(expected);
    });

    test('should parse args and return empty object if json is invalid', () => {
      const input = 'foo { "bar": "baz" } { "hello": "world" } { "foo": "bar ';
      const expected = [['foo'], [{ bar: 'baz' }, { hello: 'world' }]];
      expect(lineParser(input)).toEqual(expected);
    });
  });
});

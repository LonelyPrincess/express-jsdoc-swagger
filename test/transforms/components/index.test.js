const jsdocInfo = require('../../../consumers/jsdocInfo');
const parseComponents = require('../../../transforms/components');

describe('parseComponents method', () => {
  const initState = { components: {} };
  it('Should parse jsdoc and return default value when there is no typedef', () => {
    const jsodInput = [`
      /**
       * A song
       * @property {string} title - The title
       * @property {string} artist - The artist
       * @property {number} year - The year
       */
    `];
    const expected = {
      schemas: {},
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = parseComponents(initState, parsedJSDocs[0]);
    expect(result).toEqual(expected);
  });

  it('Should parse jsdoc component spec with basic properties', () => {
    const jsodInput = [`
      /**
       * A song
       * @typedef {object} Song
       * @property {string} title - The title
       * @property {string} artist - The artist
       * @property {number} year - The year
       */
    `];
    const expected = {
      schemas: {
        Song: {
          type: 'object',
          required: [],
          description: 'A song',
          properties: {
            title: {
              type: 'string',
              description: 'The title',
            },
            artist: {
              type: 'string',
              description: 'The artist',
            },
            year: {
              type: 'number',
              description: 'The year',
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = parseComponents(initState, parsedJSDocs[0]);
    expect(result).toEqual(expected);
  });

  it('Should parse jsdoc component spec with enum properties', () => {
    const jsodInput = [`
      /**
       * A song
       * @typedef {object} Song
       * @property {string} title - The title
       * @property {string} artist - The artist - enum:value1,value2
       * @property {number} year - The year - int64
       */
    `];
    const expected = {
      schemas: {
        Song: {
          type: 'object',
          required: [],
          description: 'A song',
          properties: {
            title: {
              type: 'string',
              description: 'The title',
            },
            artist: {
              type: 'string',
              description: 'The artist',
              enum: [
                'value1',
                'value2',
              ],
            },
            year: {
              type: 'number',
              description: 'The year',
              format: 'int64',
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = parseComponents(initState, parsedJSDocs[0]);
    expect(result).toEqual(expected);
  });

  it('Should parse jsdoc component spec with enum properties in different order', () => {
    const jsodInput = [`
      /**
       * A song
       * @typedef {object} Song
       * @property {string} title - The title
       * @property {string} artist - enum:value1,value2 - The artist
       * @property {number} year - The year - int64
       */
    `];
    const expected = {
      schemas: {
        Song: {
          type: 'object',
          required: [],
          description: 'A song',
          properties: {
            title: {
              type: 'string',
              description: 'The title',
            },
            artist: {
              type: 'string',
              description: 'The artist',
              enum: [
                'value1',
                'value2',
              ],
            },
            year: {
              type: 'number',
              description: 'The year',
              format: 'int64',
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = parseComponents(initState, parsedJSDocs[0]);
    expect(result).toEqual(expected);
  });

  it('Should parse jsdoc component spec with require and format properties', () => {
    const jsodInput = [`
      /**
       * A song
       * @typedef {object} Song
       * @property {string} title.required - The title
       * @property {string} artist - The artist
       * @property {number} year - The year - int64
       */
    `];
    const expected = {
      schemas: {
        Song: {
          type: 'object',
          required: [
            'title',
          ],
          description: 'A song',
          properties: {
            title: {
              type: 'string',
              description: 'The title',
            },
            artist: {
              type: 'string',
              description: 'The artist',
            },
            year: {
              type: 'number',
              description: 'The year',
              format: 'int64',
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = parseComponents(initState, parsedJSDocs[0]);
    expect(result).toEqual(expected);
  });

  it('Should parse two jsdoc components', () => {
    const jsodInput = [`
      /**
       * A song
       * @typedef {object} Song
       * @property {string} title.required - The title
       * @property {string} artist - The artist
       * @property {number} year - The year - int64
       */
    `,
    `
      /**
       * Album
       * @typedef {object} Album
       * @property {string} name.required - Album name
       * @property {number} length
       */
    `];
    const expected = {
      schemas: {
        Song: {
          type: 'object',
          required: [
            'title',
          ],
          description: 'A song',
          properties: {
            title: {
              type: 'string',
              description: 'The title',
            },
            artist: {
              type: 'string',
              description: 'The artist',
            },
            year: {
              type: 'number',
              description: 'The year',
              format: 'int64',
            },
          },
        },
        Album: {
          type: 'object',
          required: [
            'name',
          ],
          description: 'Album',
          properties: {
            name: {
              type: 'string',
              description: 'Album name',
            },
            length: {
              type: 'number',
              description: '',
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    let result = parseComponents(initState, parsedJSDocs[0]);
    result = parseComponents({
      components: {
        ...result,
      },
    }, parsedJSDocs[1]);
    expect(result).toEqual(expected);
  });

  it('Should parse one reference between two jsdoc components', () => {
    const jsodInput = [`
      /**
       * A song
       * @typedef {object} Song
       * @property {string} title.required - The title
       * @property {string} artist - The artist
       * @property {number} year - The year - int64
       */
    `,
    `
      /**
       * Album
       * @typedef {object} Album
       * @property {Song} firstSong
       */
    `];
    const expected = {
      schemas: {
        Song: {
          type: 'object',
          required: [
            'title',
          ],
          description: 'A song',
          properties: {
            title: {
              type: 'string',
              description: 'The title',
            },
            artist: {
              type: 'string',
              description: 'The artist',
            },
            year: {
              type: 'number',
              description: 'The year',
              format: 'int64',
            },
          },
        },
        Album: {
          type: 'object',
          required: [],
          description: 'Album',
          properties: {
            firstSong: {
              $ref: '#/components/schemas/Song',
              description: '',
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    let result = parseComponents(initState, parsedJSDocs[0]);
    result = parseComponents({
      components: {
        ...result,
      },
    }, parsedJSDocs[1]);
    expect(result).toEqual(expected);
  });

  it('Should parse empty string when description is not defined', () => {
    const jsodInput = [`
      /**
       * A song
       * @typedef {object} Song
       * @property {string} title.required
       * @property {string} artist
       * @property {number} year
       */
    `,
    `
      /**
       * Album
       * @typedef {object} Album
       * @property {Song} firstSong
       */
    `];
    const expected = {
      schemas: {
        Song: {
          type: 'object',
          required: [
            'title',
          ],
          description: 'A song',
          properties: {
            title: {
              type: 'string',
              description: '',
            },
            artist: {
              type: 'string',
              description: '',
            },
            year: {
              type: 'number',
              description: '',
            },
          },
        },
        Album: {
          type: 'object',
          required: [],
          description: 'Album',
          properties: {
            firstSong: {
              $ref: '#/components/schemas/Song',
              description: '',
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    let result = parseComponents(initState, parsedJSDocs[0]);
    result = parseComponents({
      components: {
        ...result,
      },
    }, parsedJSDocs[1]);
    expect(result).toEqual(expected);
  });

  it('Should parse two reference for one jsdoc component', () => {
    const jsodInput = [`
      /**
       * A song
       * @typedef {object} Song
       * @property {string} title.required - The title
       * @property {string} artist - The artist
       * @property {number} year - The year - int64
       */
    `,
    `
      /**
       * Author model
       * @typedef {object} Author
       * @property {string} name.required - Author name
       * @property {number} age - Author age - int64
       */
    `,
    `
      /**
       * Album
       * @typedef {object} Album
       * @property {Song} firstSong
       * @property {Author} author
       */
    `];
    const expected = {
      schemas: {
        Song: {
          type: 'object',
          required: [
            'title',
          ],
          description: 'A song',
          properties: {
            title: {
              type: 'string',
              description: 'The title',
            },
            artist: {
              type: 'string',
              description: 'The artist',
            },
            year: {
              type: 'number',
              description: 'The year',
              format: 'int64',
            },
          },
        },
        Author: {
          type: 'object',
          required: [
            'name',
          ],
          description: 'Author model',
          properties: {
            name: {
              type: 'string',
              description: 'Author name',
            },
            age: {
              type: 'number',
              description: 'Author age',
              format: 'int64',
            },
          },
        },
        Album: {
          type: 'object',
          required: [],
          description: 'Album',
          properties: {
            firstSong: {
              $ref: '#/components/schemas/Song',
              description: '',
            },
            author: {
              $ref: '#/components/schemas/Author',
              description: '',
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    let result = parseComponents(initState, parsedJSDocs[0]);
    result = parseComponents({
      components: {
        ...result,
      },
    }, parsedJSDocs[1]);
    result = parseComponents({
      components: {
        ...result,
      },
    }, parsedJSDocs[2]);
    expect(result).toEqual(expected);
  });

  it('Should parse jsdoc component spec when songs property is an array of strings', () => {
    const jsodInput = [`
      /**
       * Album
       * @typedef {object} Album
       * @property {string} title - The title
       * @property {array<string>} songs - songs array
       */
    `];
    const expected = {
      schemas: {
        Album: {
          type: 'object',
          required: [],
          description: 'Album',
          properties: {
            title: {
              type: 'string',
              description: 'The title',
            },
            songs: {
              type: 'array',
              description: 'songs array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = parseComponents(initState, parsedJSDocs[0]);
    expect(result).toEqual(expected);
  });

  it('Should parse jsdoc component spec when songs property is an array of numbers', () => {
    const jsodInput = [`
      /**
       * Album
       * @typedef {object} Album
       * @property {string} title - The title
       * @property {array<number>} years - years description
       */
    `];
    const expected = {
      schemas: {
        Album: {
          type: 'object',
          required: [],
          description: 'Album',
          properties: {
            title: {
              type: 'string',
              description: 'The title',
            },
            years: {
              type: 'array',
              description: 'years description',
              items: {
                type: 'number',
              },
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = parseComponents(initState, parsedJSDocs[0]);
    expect(result).toEqual(expected);
  });

  it('Should parse jsdoc component spec when songs property is an array of numbers with empty description', () => {
    const jsodInput = [`
      /**
       * Album
       * @typedef {object} Album
       * @property {string} title - The title
       * @property {array<number>} years
       */
    `];
    const expected = {
      schemas: {
        Album: {
          type: 'object',
          required: [],
          description: 'Album',
          properties: {
            title: {
              type: 'string',
              description: 'The title',
            },
            years: {
              type: 'array',
              description: '',
              items: {
                type: 'number',
              },
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = parseComponents(initState, parsedJSDocs[0]);
    expect(result).toEqual(expected);
  });

  it('Should parse an album schema with an array of Songs schemas.', () => {
    const jsodInput = [`
      /**
       * Album
       * @typedef {object} Album
       * @property {array<Song>} Songs
       */
    `];
    const expected = {
      schemas: {
        Album: {
          type: 'object',
          required: [],
          description: 'Album',
          properties: {
            Songs: {
              type: 'array',
              description: '',
              items: {
                $ref: '#/components/schemas/Song',
              },
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = parseComponents(initState, parsedJSDocs[0]);
    expect(result).toEqual(expected);
  });
});

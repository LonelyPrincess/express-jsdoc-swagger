const jsdocInfo = require('../../../consumers/jsdocInfo');
const setPaths = require('../../../transforms/paths');

describe('request body tests', () => {
  it('should parse jsdoc request body', () => {
    const jsodInput = [`
      /**
       * POST /api/v1
       * @param {string} id.form.required - name body description
       * @param {string} title.form.required - name body description
       */
    `];
    const expected = {
      paths: {
        '/api/v1': {
          post: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            parameters: [],
            requestBody: {
              description: 'name body description',
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: 'string',
                    },
                    required: ['id'],
                  },
                },
              },
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    console.log(JSON.stringify(result, null, 2));
    expect(result).toEqual(expected);
  });

  it.skip('should parse jsdoc request body with array type and no description', () => {
    const jsodInput = [
      `
      /**
       * POST /api/v1/albums
       * @param {array<object>} request.body.required
       */
    `];
    const expected = {
      paths: {
        '/api/v1/albums': {
          post: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            parameters: [],
            requestBody: {
              description: '',
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    expect(result).toEqual(expected);
  });

  it.skip('should parse jsdoc request body with array type', () => {
    const jsodInput = [`
      /**
       * POST /api/v1
       * @param {array<string>} request.body.required - name body description
       */
    `];
    const expected = {
      paths: {
        '/api/v1': {
          post: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            parameters: [],
            requestBody: {
              description: 'name body description',
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    expect(result).toEqual(expected);
  });

  it.skip('should parse jsdoc path reference bodys', () => {
    const jsodInput = [`
      /**
       * POST /api/v1
       * @param {Song} request.body.required - name body description
       */
    `];
    const expected = {
      paths: {
        '/api/v1': {
          post: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            parameters: [],
            requestBody: {
              description: 'name body description',
              required: true,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Song',
                  },
                },
              },
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    expect(result).toEqual(expected);
  });

  it.skip('should parse jsdoc request body with array of references', () => {
    const jsodInput = [`
      /**
       * POST /api/v1
       * @param {array<Song>} request.body.required - name body description
       */
    `];
    const expected = {
      paths: {
        '/api/v1': {
          post: {
            deprecated: false,
            summary: '',
            responses: {},
            tags: [],
            security: [],
            parameters: [],
            requestBody: {
              description: 'name body description',
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Song',
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = setPaths({}, parsedJSDocs);
    expect(result).toEqual(expected);
  });
});

const jsdocInfo = require('../../../consumers/jsdocInfo');
const parseTags = require('../../../transforms/tags');

describe('parseTags method', () => {
  it('Should not parse params that aren\'t tags', () => {
    const jsodInput = [`
      /**
       * GET /api/v1/album
       * @summary example of no summary
       */
    `];
    const expected = [];
    const parsedJSDocs = jsdocInfo()(jsodInput);
    const result = parseTags({}, parsedJSDocs[0]);
    expect(result).toEqual(expected);
  });

  it('should return empty tags array with not an array as parameter', () => {
    const initialState = {};
    const tags = 2;
    const expected = [];
    const result = parseTags(initialState, tags);
    expect(result).toEqual(expected);
  });

  it('Should parse jsdoc tags into tags array with name and description', () => {
    const jsodInput = [`
      /**
       * GET /api/v1/album
       * @tags album - album tag description
       */
    `,
    `
      /**
       * GET /api/v1/artists
       * @tags artist - artist tag description
       */
    `];
    const expected = [
      {
        name: 'album',
        description: 'album tag description',
      },
      {
        name: 'artist',
        description: 'artist tag description',
      },
    ];
    const parsedJSDocs = jsdocInfo()(jsodInput);
    let result = parseTags({}, parsedJSDocs[0]);
    result = parseTags({ tags: result }, parsedJSDocs[1]);
    expect(result).toEqual(expected);
  });

  it('Should parse jsdoc tags into tags array without duplicate tags', () => {
    const jsodInput = [`
      /**
       * GET /api/v1/album
       * @tags album - album tag description
       */
    `,
    `
      /**
       * GET /api/v1/years
       * @tags artist - artist tag description
       */
    `,
    `
      /**
       * GET /api/v1/artists
       * @tags artist - artist tag description
       */
    `];
    const expected = [
      {
        name: 'album',
        description: 'album tag description',
      },
      {
        name: 'artist',
        description: 'artist tag description',
      },
    ];
    const parsedJSDocs = jsdocInfo()(jsodInput);
    let result = parseTags({}, parsedJSDocs[0]);
    result = parseTags({ tags: result }, parsedJSDocs[1]);
    result = parseTags({ tags: result }, parsedJSDocs[2]);
    expect(result).toEqual(expected);
  });

  it('Should return an empty string if the tag has no description', () => {
    const jsodInput = [`
      /**
       * GET /api/v1/album
       * @tags album - album tag description
       */
    `,
    `
      /**
       * GET /api/v1/years
       * @tags artist
       */
    `];
    const expected = [
      {
        name: 'album',
        description: 'album tag description',
      },
      {
        name: 'artist',
        description: '',
      },
    ];
    const parsedJSDocs = jsdocInfo()(jsodInput);
    let result = parseTags({}, parsedJSDocs[0]);
    result = parseTags({ tags: result }, parsedJSDocs[1]);
    expect(result).toEqual(expected);
  });

  it('Should return one tag with its description', () => {
    const jsodInput = [`
      /**
       * GET /api/v1/album
       * @tags album
       */
    `,
    `
      /**
       * GET /api/v1/years
       * @tags album - album tag description
       */
    `];
    const expected = [
      {
        name: 'album',
        description: 'album tag description',
      },
    ];
    const parsedJSDocs = jsdocInfo()(jsodInput);
    let result = parseTags({}, parsedJSDocs[0]);
    result = parseTags({ tags: result }, parsedJSDocs[1]);
    expect(result).toEqual(expected);
  });
});

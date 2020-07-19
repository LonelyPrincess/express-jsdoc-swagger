const getBasicInfo = require('./basic');
const getSecuritySchemes = require('./security');
const getPaths = require('./paths');
const getComponents = require('./components');
const getTags = require('./tags');

const initialState = {
  paths: {},
  tags: [],
};

const mainTransform = swaggerObject => (data = []) => new Promise(resolve => {
  if (!Array.isArray(data) || data.length === 0) {
    return resolve({ ...swaggerObject, ...initialState });
  }
  const parseResult = data.reduce((acum, item) => (
    {
      ...acum,
      paths: {
        ...getPaths(acum, item),
      },
      tags: getTags(acum, item),
      components: getComponents(acum, item),
    }
  ), swaggerObject);
  return resolve(parseResult);
});

module.exports = {
  getBasicInfo,
  getComponents,
  getSecuritySchemes,
  mainTransform,
};

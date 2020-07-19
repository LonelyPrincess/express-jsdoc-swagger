const getBasicInfo = require('./basic');
const getSecuritySchemes = require('./security');
const getPaths = require('./paths');
const getComponents = require('./components');
const getTags = require('./tags');

const initialState = {
  paths: {},
  tags: [],
};

const mainTransform = (swaggerObject, data = []) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { ...swaggerObject, ...initialState };
  }
  return data.reduce((acum, item) => (
    {
      ...acum,
      paths: {
        ...getPaths(acum, item),
      },
      tags: getTags(acum, item),
    }
  ), swaggerObject);
};

module.exports = {
  getBasicInfo,
  getPaths,
  getComponents,
  getTags,
  getSecuritySchemes,
  mainTransform,
};

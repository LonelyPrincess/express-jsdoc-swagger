const readFiles = require('./consumers/readFiles');
const globFilesMatches = require('./consumers/globFilesMatches');
const getOnlyComments = require('./consumers/getOnlyComments');
const jsdocInfo = require('./consumers/jsdocInfo');
const {
  getBasicInfo,
  getSecuritySchemes,
  mainTransform,
} = require('./transforms');

const defaultLogger = () => null;

const processSwagger = (options, logger = defaultLogger) => {
  let swaggerObject = {
    openapi: '3.0.0',
    info: options.info,
    servers: options.servers,
    security: options.security,
  };

  swaggerObject = getBasicInfo(swaggerObject);
  logger({ entity: 'basicInfo', swaggerObject });
  swaggerObject = getSecuritySchemes(swaggerObject);
  logger({ entity: 'securitySchemas', swaggerObject });

  return globFilesMatches(options.baseDir, options.filesPattern)
    .then(readFiles)
    .then(getOnlyComments)
    .then(jsdocInfo())
    .then(mainTransform(swaggerObject))
    .then(result => {
      logger({ entity: 'endpoints', swaggerObject: result });
      return result;
    });
};

module.exports = processSwagger;

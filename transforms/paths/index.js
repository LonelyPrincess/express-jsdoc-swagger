const responsesGenerator = require('./responses');
const parametersGenerator = require('./parameters');
const requestBodyGenerator = require('./requestBody');
const getSchema = require('./schema');
const { getTagInfo, getTagsInfo, formatDescriptionTag } = require('../utils/tags');
const {
  validRequestBodyMethods: bodyMethods,
  validHTTPMethod,
} = require('../utils/httpMethods');

const formatTags = (tags = []) => tags.map(({ description }) => {
  const { name } = formatDescriptionTag(description);
  return name;
});

const formatSecurity = (securityValues = []) => securityValues.map(({ description }) => ({
  [description]: [],
}));

const formatSummary = summary => (summary || {}).description || '';

const setRequestBody = (lowerCaseMethod, bodyValues) => {
  const hasBodyValues = bodyValues.length > 0;
  const requestBody = requestBodyGenerator(bodyValues);
  return bodyMethods[lowerCaseMethod] && hasBodyValues ? { requestBody } : {};
};

const filterParams = type => ({ name }) => name.includes(type);

const bodyParams = filterParams('request.body');
const formParams = filterParams('.form');

const parseBodyParameter = (currentState, body) => {
  console.log(body);
  const options = {
    name,
    in: inOption,
    required: isRequired,
    deprecated: isDeprecated,
    description,
  };
  const schema = getSchema('@param', body.name)(body.type);
  console.log(schema);
  return {};
};

const foo = (params = []) => {
  if (!params || !Array.isArray(params)) return {};
  const requestBody = params.reduce((acc, body) => (
    { ...acc, ...parseBodyParameter(acc, body) }
  ), { content: {} });
  return requestBody;
};

const pathValues = tags => {
  const summary = getTagInfo(tags, 'summary');
  const deprecated = getTagInfo(tags, 'deprecated');
  const isDeprecated = !!deprecated;
  /* Response info */
  const returnValues = getTagsInfo(tags, 'return');
  const responses = responsesGenerator(returnValues);
  /* Parameters info */
  const paramValues = getTagsInfo(tags, 'param');
  const parameters = parametersGenerator(paramValues);
  /* Tags info */
  const tagsValues = getTagsInfo(tags, 'tags');
  /* Security info */
  const securityValues = getTagsInfo(tags, 'security');
  /* Request body info */
  const bodyValues = paramValues.filter(bodyParams);
  /* */
  const formValues = paramValues.filter(formParams);
  return {
    summary,
    isDeprecated,
    responses,
    parameters,
    tagsValues,
    bodyValues,
    securityValues,
    formValues,
  };
};

const parsePath = (path, state) => {
  if (!path.description || !path.tags) return {};
  const [method, endpoint] = path.description.split(' ');
  // if jsdoc comment does not contain structure <Method> - <Endpoint> is not valid path
  const lowerCaseMethod = method.toLowerCase();
  if (!validHTTPMethod(lowerCaseMethod)) return {};
  const { tags } = path;
  const {
    summary, bodyValues, isDeprecated, responses, parameters, tagsValues, securityValues,
    formValues,
  } = pathValues(tags);
  console.log(foo(formValues));
  return {
    ...state,
    [endpoint]: {
      ...state[endpoint],
      [lowerCaseMethod]: {
        deprecated: isDeprecated,
        summary: formatSummary(summary),
        security: formatSecurity(securityValues),
        responses,
        parameters,
        tags: formatTags(tagsValues),
        ...(setRequestBody(lowerCaseMethod, bodyValues)),
        ...(setRequestBody(lowerCaseMethod, formValues)),
      },
    },
  };
};

const getPathObject = paths => paths.reduce((acum, item) => ({
  ...acum, ...parsePath(item, acum),
}), {});

const parsePaths = (swaggerObject = {}, paths = []) => {
  if (!paths || !Array.isArray(paths)) return { paths: {} };
  const pathObject = getPathObject(paths);
  return {
    ...swaggerObject,
    paths: pathObject,
  };
};

module.exports = parsePaths;

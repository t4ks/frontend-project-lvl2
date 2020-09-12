import yaml from 'js-yaml';
import ini from 'ini';

const SUPPORTED_PARSERS = {
  '.json': (data) => JSON.parse(data),
  '.yaml': (data) => yaml.load(data),
  '.ini': (data) => ini.parse(data),
};

export default (data, ext) => {
  const parse = SUPPORTED_PARSERS[ext];
  return parse(data);
};

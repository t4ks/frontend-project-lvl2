import yaml from 'js-yaml';
import ini from 'ini';

const supportedParsers = {
  '.json': JSON.parse,
  '.yaml': yaml.load,
  '.ini': ini.parse,
};

export default (data, ext) => {
  const parse = supportedParsers[ext];
  return parse(data);
};

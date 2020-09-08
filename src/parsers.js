import yaml from 'js-yaml';
import ini from 'ini';

const jsonParser = (data) => JSON.parse(data);
const yamlParser = (data) => yaml.load(data);
const iniParser = (data) => ini.parse(data);

const getParser = (ext) => ({
  '.json': jsonParser,
  '.yaml': yamlParser,
  '.ini': iniParser,
}[ext]);

export default (config, ext) => {
  const parser = getParser(ext);
  return parser(config);
};

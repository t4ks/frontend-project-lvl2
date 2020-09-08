import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import fs from 'fs';

const jsonParser = (data) => JSON.parse(data);
const yamlParser = (data) => yaml.load(data);
const iniParser = (data) => ini.parse(data);

const getParser = (ext) => ({
  '.json': jsonParser,
  '.yaml': yamlParser,
  '.ini': iniParser,
}[ext]);

export default (filepath) => {
  const ext = path.extname(filepath);
  const parser = getParser(ext);
  return parser(fs.readFileSync(filepath, 'utf-8'));
};

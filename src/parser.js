import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';

const jsonParser = (data) => JSON.parse(data);
const yamlParser = (data) => yaml.load(data);

const getParser = (ext) => {
    switch (ext) {
        case '.json':
            return jsonParser;
        case '.yaml':
            return yamlParser;
        default:
            return jsonParser;
    }
}

export default (filepath) => {
    const ext = path.extname(filepath);
    const parser = getParser(ext);
    return parser(fs.readFileSync(filepath, { encoding: 'utf-8' }));
}
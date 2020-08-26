import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

export default (formatter) => ({ stylish, plain, json }[formatter]);

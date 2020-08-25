import stylish from './stylish.js';
import plain from './plain.js';

export default (formatter) => ({ stylish, plain }[formatter]);

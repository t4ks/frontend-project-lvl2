install:
	npm install

publish:
	npm publish --dry-run

run:
	node --experimental-json-module ./gendiff.js

lint:
	npx eslint .


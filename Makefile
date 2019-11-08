install: 
	npm install

run:
	npx babel-node src/bin/

install-deps:
	npm install

build:
	npm run build
	
lint:
	npx eslint .

test:
	npm run test

test-coverage:
	npm test -- --coverage

publish: 
	npm publish --dry-run

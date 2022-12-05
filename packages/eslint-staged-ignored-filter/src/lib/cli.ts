#!/usr/bin/env node

import { argv } from 'node:process';

import { filterIgnored } from './filter-ignored';

const [, , ...files] = argv;

(async () => {
  console.log((await filterIgnored(files)).join(' '));
})();

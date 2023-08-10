#! /usr/bin/env node
const { ESLint } = require('eslint');

const reduceToArgsAndFiles = (args) => {
  return args.reduce(
    (accumulator, arg, i) => {
      if (arg.startsWith('--')) {
        if (arg.includes('=')) {
          const [key, value] = arg.split('=');
          accumulator.args[key] = value;
        } else {
          accumulator.args[arg] = args[i + 1];
        }
      } else if (
        !args[i - 1] ||
        !args[i - 1].startsWith('--') ||
        args[i - 1].includes('=')
      ) {
        accumulator.files.push(arg);
      }

      return accumulator;
    },
    { args: {}, files: [] }
  );
};

const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint();
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file);
    })
  );
  const filteredFiles = files.filter((_, i) => !isIgnored[i]);
  return filteredFiles.join(' ');
};

const eslint = async ({ args, files }) => {
  const filesToLint = await removeIgnoredFiles(files);
  const eslintArgs = Object.entries(args).flat().join(' ').trim();
  return `eslint ${eslintArgs} ${filesToLint}`;
};
const [, , ...args] = process.argv;
const parsedArgs = reduceToArgsAndFiles(args);

eslint(parsedArgs).then(console.log);

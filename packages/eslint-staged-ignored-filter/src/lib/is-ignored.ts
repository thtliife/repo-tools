import { ESLint } from 'eslint';

const eslint = new ESLint();

/**
 * Takes a file path and returns a promise that resolves to a boolean indicating whether or not the
 * file is ignored by ESLint
 * @param {string} file - The file to check.
 * @returns {Promise<boolean>} A promise that resolves to a boolean.
 */

export const isIgnored = async (file: string): Promise<boolean> => {
  const res = await eslint.isPathIgnored(file);
  return res;
};

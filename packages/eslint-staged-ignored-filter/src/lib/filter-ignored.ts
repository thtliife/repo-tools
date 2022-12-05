import { isIgnored } from './is-ignored';

export type FilterIgnoredProps = string | string[];
export type IgnoredFilesType = string[];

const removeEslintIgnoredFiles = async (file: string) =>
  !(await isIgnored(file)) && file;

/**
 * Takes an array of file paths or a space delimited string of file paths and returns an array
 * of file paths that are not ignored by ESLint
 * @param {FilterIgnoredProps} files - The files to check.
 * @returns {Promise<(string | false)[]>} An promise that resolves to an array of file paths that are not ignored by ESLint
 */
export const filterIgnored = async (files: FilterIgnoredProps) => {
  const filesArray = typeof files === 'string' ? files.split(' ') : files;
  const ignoredFiles = await Promise.all(
    filesArray.map(await removeEslintIgnoredFiles)
  );
  return await ignoredFiles.filter(Boolean);
};

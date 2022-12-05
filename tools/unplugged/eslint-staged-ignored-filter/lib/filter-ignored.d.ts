export declare type FilterIgnoredProps = string | string[];
export declare type IgnoredFilesType = string[];
/**
 * Takes an array of file paths or a space delimited string of file paths and returns an array
 * of file paths that are not ignored by ESLint
 * @param {FilterIgnoredProps} files - The files to check.
 * @returns {Promise<(string | false)[]>} An promise that resolves to an array of file paths that are not ignored by ESLint
 */
export declare const filterIgnored: (files: FilterIgnoredProps) => Promise<(string | false)[]>;

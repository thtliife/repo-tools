/**
 * Takes a file path and returns a promise that resolves to a boolean indicating whether or not the
 * file is ignored by ESLint
 * @param {string} file - The file to check.
 * @returns {Promise<boolean>} A promise that resolves to a boolean.
 */
export declare const isIgnored: (file: string) => Promise<boolean>;

import { execSync } from 'node:child_process';

describe('Filtering on the cli', () => {
  const defaultIgnoredFile = '.eslintrc';
  const mainFile = 'packages/eslint-staged-ignored-filter/index.ts';
  const configIgnoredFile = 'jest.config.ts';

  it('Outputs files which are not ignored by default in ESLint', () => {
    const result = execSync(
      `yarn ts-node ${__dirname}/cli.ts ${defaultIgnoredFile} ${mainFile}`,
      { encoding: 'utf-8' }
    );
    expect(result).toEqual(expect.stringMatching(mainFile));
  });

  it('Outputs files which are not ignored by config in ESLint', () => {
    const result = execSync(
      `yarn ts-node ${__dirname}/cli.ts ${mainFile} ${configIgnoredFile}`,
      { encoding: 'utf-8' }
    );
    expect(result).toEqual(expect.stringMatching(mainFile));
  });
});

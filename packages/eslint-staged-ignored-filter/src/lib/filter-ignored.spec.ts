import { filterIgnored } from './filter-ignored';

describe('Filtering via library api', () => {
  const defaultIgnoredFile = '.eslintrc';
  const mainFile = 'packages/eslint-staged-ignored-filter/index.ts';
  const configIgnoredFile = 'jest.config.ts';

  it('Outputs an array of files which are not ignored by default in ESLint', async () => {
    const result = await filterIgnored([mainFile, defaultIgnoredFile]);
    expect(result).toEqual([mainFile]);
  });

  it('Outputs an array of files which are not ignored by config in ESLint', async () => {
    const result = await filterIgnored([mainFile, configIgnoredFile]);
    expect(result).toEqual([mainFile]);
  });
});

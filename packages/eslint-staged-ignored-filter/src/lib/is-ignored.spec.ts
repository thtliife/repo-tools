import { isIgnored } from './is-ignored';

describe('Determine if file is ignored by ESLint', () => {
  const defaultIgnoredFile = '.eslintrc';
  const mainFile = 'packages/eslint-staged-ignored-filter/index.ts';
  const configIgnoredFile = 'jest.config.ts';

  it('Returns true if file is ignored by default in ESLint', async () => {
    const result = await isIgnored(defaultIgnoredFile);
    expect(result).toEqual(true);
  });

  it('Returns true if file is ignored by config in ESLint', async () => {
    const result = await isIgnored(configIgnoredFile);
    expect(result).toEqual(true);
  });

  it('Returns false if file is not ignored by ESLint', async () => {
    const result = await isIgnored(mainFile);
    expect(result).toEqual(false);
  });
});

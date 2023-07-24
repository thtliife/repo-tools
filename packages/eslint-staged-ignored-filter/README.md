# eslint-staged-ignored-filter

A small helper utility for filtering out the files ignored by eslint when performing a linting test.

It is mainly useful when linting as a pre-commit hook for git. (vanilla hook, [lint-staged](https://github.com/okonet/lint-staged), [husky](https://github.com/typicode/husky), etc...)

## Install

`npm install --save-dev @thtliife/eslint-staged-ignored-filter`

or

`yarn add --dev @thtliife/eslint-staged-ignored-filter`

## Use

There are two ways this util can be used.

I prefer to use vanilla git hooks, rather than installing a package like [husky](https://github.com/typicode/husky) or [lint-staged](https://github.com/okonet/lint-staged).

### CLI

For this use case, the cli tool is the easiest way, as native githooks are standard shell scripts.
The cli is usable as follows:

```shell
eslint-staged-ignored-filter file1.js file2.js file3.ts ... lastfile.tsx
```

it is also aliased to the shorter command `esif` so can be used as follows:

```shell
esif file1.js file2.js file3.ts ... lastfile.tsx
```

An example script for using this as a vanilla githook is:

```shell
#!/usr/bin/env bash

# Get the currently staged files
declare -a STAGED_FILES=($(git diff --cached --name-only --diff-filter=ACMR | sed 's| |\\ |g'))

# Quit if nothing is staged
[ -z "$STAGED_FILES" ] && exit 0

# Determine the package runner via lock files, falling back to "npx"
# yarn outputs extra text on running packages, so need to silence that with --silent option
[ -z "$PACKAGE_RUNNER" ] && [ -f "./yarn.lock" ] && PACKAGE_RUNNER="yarn --silent"
[ -z "$PACKAGE_RUNNER" ] && [ -f "./pnpm-lock.yaml" ] && PACKAGE_RUNNER="pnpm"
[ -z "$PACKAGE_RUNNER" ] && [ -f "./package-lock.json" ] && PACKAGE_RUNNER="npx"
[ -z "$PACKAGE_RUNNER" ] && PACKAGE_RUNNER="npx"

ESLINT_INSTALLED=$(npm --silent list eslint >/dev/null && echo true || echo false)

# Lint staged files with eslint if it is installed in the project
if [ "$ESLINT_INSTALLED" = "true" ]; then
  # Filter the staged files by file extension that we want to lint
  STAGED_FILES_TO_LINT=$((IFS=$'\n' && echo "${STAGED_FILES[*]}") | grep -E '.*\.(js|jsx|tsx|ts)$')

  # Get files that eslint can process, which will not throw "Ignored" warnings
  LINTABLE_FILES=$($PACKAGE_RUNNER esif ${STAGED_FILES_TO_LINT})

  # Exit if no staged files are lintable
  [ -z "$LINTABLE_FILES" ] && exit 0

  echo ""
  echo Running eslint on staged files...
  # Run eslint using the detected package runner
  $PACKAGE_RUNNER eslint $LINTABLE_FILES --max-warnings 0 --report-unused-disable-directives --fix

  # Get the eslint exit code
  ESLINT_EXIT="$?"

  # Re-add files since they may have been fixed
  # Remove the next line if you are not running eslint with the --fix option
  git add "${LINTABLE_FILES}"

  # Test the eslint exit code for non-zero status
  if [[ "${ESLINT_EXIT}" == 0 ]]; then
    echo "✔ Ok"
  else
    echo "✘ COMMIT FAILED: Fix eslint errors and try again"
    exit $ESLINT_EXIT
  fi
fi
```

### API

If you are using a tool like [lint-staged](https://github.com/okonet/lint-staged), you should use the exported `filterIgnored` function in your .lintstagedrc.js configuration file as below.

The `filterIgnored` function receives a list of paths either as a space delimited string, or as an array, and outputs an array of files which eslint will not ignore.

An example `.lintstagedrc.js` file might look like:

```js
import { filterIgnored } from '@thtliife/eslint-staged-ignored-filter';

export default {
  '**/*.{ts,tsx,js,jsx}': async (files) => {
    const filesToLint = (await filterIgnored(files)).join(' ');
    return [`eslint --max-warnings=0 ${filesToLint}`];
  }
};
```

## Building

Run `yarn nx build eslint-staged-ignored-filter` to build the library.

## Running unit tests

Run `yarn nx test eslint-staged-ignored-filter` to execute the unit tests via [Jest](https://jestjs.io).

---

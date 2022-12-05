const name = 'eslint-staged-ignored-filter';
const srcRoot = `packages/${name}`;

const config = {
  extends: './release.config.base.js',
  pkgRoot: `dist/${srcRoot}`,
  tagFormat: name + '-v${version}',
  commitPaths: [`${srcRoot}/*`],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    [
      '@semantic-release/release-notes-generator',
      { preset: 'conventionalcommits' }
    ],
    [
      '@semantic-release/changelog',
      { changelogFile: `${srcRoot}/CHANGELOG.md` }
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: `dist/${srcRoot}`
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: [`${srcRoot}/package.json`, `${srcRoot}/CHANGELOG.md`],
        message:
          `chore(release): release ${name} ` +
          '${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ]
};

module.exports = config;

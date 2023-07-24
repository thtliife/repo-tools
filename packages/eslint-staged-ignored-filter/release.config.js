const name = 'eslint-staged-ignored-filter';
const srcRoot = `packages/${name}`;

const config = {
  extends: ['../../release.config.js', 'semantic-release-npm-github-publish'],
  branch: 'main',
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
        pkgRoot: `dist/${srcRoot}`,
        npmPublish: true
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: [`${srcRoot}/package.json`, `${srcRoot}/CHANGELOG.md`],
        message:
          `chore(release): publish version ${name} ` +
          '${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ]
};

module.exports = config;

import type { UserConfig } from '@commitlint/types';
import { ProjectConfiguration } from 'nx/src/config/workspace-json-project-json';
import { Workspaces } from 'nx/src/config/workspaces';

/**
 * @param {(params: Pick<Nx.ProjectConfiguration, 'name' | 'projectType' | 'tags'>) => boolean} selector
 */

export interface ProjectContext {
  cwd?: string;
}

export type Selector = Partial<ProjectConfiguration>;

const getProjects = (
  context: ProjectContext,
  selector = (selectorObj: Selector) => true
) => {
  return Promise.resolve()
    .then(() => {
      const ctx = context || {};
      const cwd = ctx.cwd || process.cwd();
      const ws = new Workspaces(cwd);
      const workspace = ws.readWorkspaceConfiguration();
      return Object.entries(workspace.projects || {}).map(
        ([name, project]) => ({
          name,
          ...project
        })
      );
    })
    .then((projects) => {
      return projects
        .filter((project) =>
          selector({
            name: project.name,
            projectType: project.projectType,
            tags: project.tags
          })
        )
        .filter((project) => project.targets)
        .map((project) => project.name)
        .map((name) => (name.charAt(0) === '@' ? name.split('/')[1] : name));
    });
};

export const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-length': [0, 'always', 0],
    'body-max-line-length': [0, 'always', 0],
    // @ts-ignore
    'scope-enum': (ctx) =>
      getProjects(ctx).then((packages) => [
        2,
        'always',
        [...packages, 'release']
      ]),
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'add',
        'breaking',
        'build',
        'chore',
        'ci',
        'config',
        'docs',
        'downgrade',
        'egg',
        'feat',
        'fix',
        'i18n',
        'perf',
        'refactor',
        'release',
        'remove',
        'revert',
        'security',
        'style',
        'test',
        'upgrade'
      ]
    ]
  },
  helpUrl:
    '\n    This repository uses conventional commits. See: https://www.conventionalcommits.org \n    The specific configuration is as per: https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#commitlintconfig-conventional'
};

export default config;

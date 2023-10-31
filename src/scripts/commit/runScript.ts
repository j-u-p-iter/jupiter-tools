import path from 'path';
import { createRequire } from '../../utils.js';
// @ts-ignore
import { bootstrap } from 'commitizen/dist/cli/git-cz.js';

const require = createRequire(import.meta.url);

const getPathToCommitizenRootDir = () => {
  return path.dirname(require.resolve('commitizen/package.json'));
}

bootstrap({
  cliPath: getPathToCommitizenRootDir(),
  config: {
    path: 'cz-conventional-changelog',
  },
})

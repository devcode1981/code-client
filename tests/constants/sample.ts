import path from 'path';

import { IFileInfo } from '../../src/interfaces/files.interface';
import { getFileInfo, notEmpty } from '../../src/files';

export const sampleProjectPath = path.resolve(__dirname, '../sample-repo');
export const supportedFiles = {
  extensions: ['.js', '.cpp', '.java'],
  configFiles: ['.eslintrc.json', '.dcignore'],
};

export const bundleFileIgnores = ['**/.git', `${sampleProjectPath}/**/models`, `${sampleProjectPath}/**/controllers`];

export const bundleFilePaths = [
  '/.eslintrc.json',
  'AnnotatorTest.cpp',
  'GitHubAccessTokenScrambler12.java',
  'app.js',
  'db.js',
  'main.js',
  'routes/index.js',
  'routes/sharks.js',
];

async function getBundleFiles(withContent: boolean) {
  return (await Promise.all(
    bundleFilePaths.map(f => getFileInfo(path.join(sampleProjectPath, f), sampleProjectPath, withContent)),
  )).filter(notEmpty);
}

export const bundleFiles: Promise<(IFileInfo)[]> = getBundleFiles(false);
export const bundleFilesFull: Promise<IFileInfo[]> = getBundleFiles(true);

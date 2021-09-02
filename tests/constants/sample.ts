import path from 'path';
import fs from 'fs';

import { FileInfo } from '../../src/interfaces/files.interface';
import { getFileInfo, notEmpty } from '../../src/files';

export const sampleProjectPath = path.resolve(__dirname, '../sample-repo');
export const supportedFiles = {
  extensions: ['.js', '.jsx', '.cpp', '.java'], // <= not aligned with currently returned extensions from backend
  configFiles: ['.eslintrc.json', '.dcignore'], // <= we are not running linters in the backend anymore
};

export const bundlefileExcludes = [`${sampleProjectPath}/exclude/**`];

export const bundleFileIgnores = [
  '**/.git/**',
  `${sampleProjectPath}/**/mode_nodules/**`,
  `${sampleProjectPath}/models/**`,
  `${sampleProjectPath}/**/controllers/**`,
  `${sampleProjectPath}/**/ignored/**`,
  `${sampleProjectPath}/**/ignored`,
  `!${sampleProjectPath}/**/not/ignored/**`,
  `!${sampleProjectPath}/**/not/ignored`,
  `${sampleProjectPath}/**/*.jsx/**`,
  `${sampleProjectPath}/**/*.jsx`,
];

export const bundleFilePaths = [
  '/.eslintrc.json', // <= we are not running linters in the backend anymore
  'AnnotatorTest.cpp',
  'GitHubAccessTokenScrambler12.java',
  'app.js',
  'db.js',
  'main.js', // <= file size is over the custom maxPayload used in some tests (23098 > 1000)
  'routes/index.js',
  'routes/sharks.js',
  // TODO: This should be ignored for consistency with the .gitignore format (see last rule above),
  // however we decided to tune down correctness in favour of perfomance for now.
  'not/ignored/this_should_be_ignored.jsx',
  'not/ignored/this_should_not_be_ignored.java',
];

async function getBundleFiles(withContent: boolean) {
  return (
    await Promise.all(
      bundleFilePaths.map(f => getFileInfo(path.join(sampleProjectPath, f), sampleProjectPath, withContent)),
    )
  ).filter(notEmpty);
}

export const bundleFiles: Promise<FileInfo[]> = getBundleFiles(false);
export const bundleFilesFull: Promise<FileInfo[]> = getBundleFiles(true);

export const bundleExtender: () => Promise<{
  files: { removed: string; changed: string; added: string; all: string[] };
  exec: () => void;
  restore: () => void;
}> = async () => {
  const fBundle = await bundleFilesFull;
  const changedFilesNames = [`GitHubAccessTokenScrambler12.java`, `AnnotatorTest.cpp`];
  const addedFilesNames = [`GHATS12.java`];
  const [changedFiles, addedFiles] = [changedFilesNames, addedFilesNames].map(arr =>
    arr.map(name => `${sampleProjectPath}/${name}`),
  );
  const original = changedFiles.map(path => fBundle.find(f => f.filePath === path)?.content);
  if (original.some(c => !c)) throw new Error('Content not found. Impossible to restore');
  return {
    files: {
      removed: changedFilesNames[0],
      changed: changedFilesNames[1],
      added: addedFilesNames[0],
      all: [...addedFilesNames, ...changedFilesNames],
    },
    exec: () => {
      fs.writeFileSync(addedFiles[0], original![0]!);
      fs.unlinkSync(changedFiles[0]);
      fs.writeFileSync(changedFiles[1], `#include <fstream>`);
    },
    restore: () => {
      fs.writeFileSync(changedFiles[0], original![0]!);
      fs.writeFileSync(changedFiles[1], original![1]!);
      fs.unlinkSync(addedFiles[0]);
    },
  };
};

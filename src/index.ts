import { analyzeFolders } from './analysis';
import { createBundleFromFolders } from './bundles';
import emitter from './emitter';
import { startSession, checkSession, getAnalysis } from './http';
import * as constants from './constants';
import { getGlobPatterns } from './files';

import { SupportedFiles } from './interfaces/files.interface';
import { AnalysisSeverity } from './interfaces/analysis-options.interface';
import { AnalysisResult } from './interfaces/analysis-result.interface';

export {
  getGlobPatterns,
  analyzeFolders,
  createBundleFromFolders,
  // extendAnalysis,
  getAnalysis,
  startSession,
  checkSession,
  emitter,
  constants,
  AnalysisSeverity,
  AnalysisResult,
  SupportedFiles,
};

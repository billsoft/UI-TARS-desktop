import path from 'path';
import fs from 'fs/promises';
import * as esbuild from 'esbuild';

/**
 * Build Readability script and generate type definitions
 */
async function buildReadability(): Promise<void> {
  try {
    // Get the path to Readability.js using node resolution
    const readabilityPath = require.resolve(
      '@mozilla/readability/Readability.js',
    );

    const srcDir = path.resolve(__dirname, '../src');
    const constantsPath = path.join(srcDir, 'readability-script.ts');

    const result = await esbuild.build({
      entryPoints: [readabilityPath],
      bundle: true,
      write: false,
      format: 'cjs',
      minify: true,
      platform: 'browser',
      target: 'es2015',
    });

    const code = result.outputFiles[0].text;

    await fs.writeFile(
      constantsPath,
      `/*
 * Copyright (c) 2025 Bytedance, Inc. and its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */
      
/**
 * PLEASE DO NOT MODIFY IT
 * Generated by packages/browser/scripts/build-readability.ts
 */
export const READABILITY_SCRIPT = ${JSON.stringify(code)};`,
      'utf8',
    );

    console.log('Successfully built Readability script');
  } catch (error) {
    console.error('Failed to build readability:', error);
    process.exit(1);
  }
}

buildReadability();

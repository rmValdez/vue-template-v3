#!/usr/bin/env node
/**
 * FAOS Architecture Validator for Vue 3 Template
 *
 * A static import-boundary scanner for Vue 3 SPA architecture.
 * Ensures strict encapsulation between features/, shared/, and router/app layers.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../src');

let hasViolations = false;

function logViolation(file, rule, description) {
  console.error(`\x1b[31m[VIOLATION]\x1b[0m ${file}`);
  console.error(`  ↳ \x1b[33mRule:\x1b[0m ${rule}`);
  console.error(`  ↳ \x1b[36mDetails:\x1b[0m ${description}\n`);
  hasViolations = true;
}

/**
 * Superfast static extraction of imports from file content (supports TS, JS, and Vue SFCs)
 */
function extractImports(content) {
  const imports = [];
  const importRegex = /import\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"]/g;
  const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

/**
 * Scan a file and run boundary assertion rules
 */
function validateFile(filePath, relativePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = extractImports(content);

  // Clean up paths for processing
  const normalizedRelPath = relativePath.split(path.sep).join('/');
  const pathParts = normalizedRelPath.split('/');
  const layer = pathParts[0]; // 'app', 'features', 'shared', or 'router'

  for (const imp of imports) {
    // 1. Enforce Absolute Imports Strategy for cross-folder references
    if (imp.startsWith('../../..') || imp.startsWith('../../../..')) {
      logViolation(
        normalizedRelPath,
        'Import Strategy',
        `Forbidden deep relative import "${imp}". Use absolute path aliases instead (@/*).`
      );
    }

    // 2. Map aliases back to logical layers
    let impLayer = null;
    let impFeature = null;

    if (imp.startsWith('@/app') || imp.startsWith('app/')) impLayer = 'app';
    if (imp.startsWith('@/router') || imp.startsWith('router/'))
      impLayer = 'router';
    if (imp.startsWith('@/shared') || imp.startsWith('shared/'))
      impLayer = 'shared';
    if (imp.startsWith('@/features/') || imp.startsWith('features/')) {
      impLayer = 'features';
      const parts = imp.replace(/^(@\/)?features\//, '').split('/');
      impFeature = parts[0];
    }

    if (!impLayer) continue;

    // --- Boundary Rule Layer Engine ---

    // Shared Layer Constraints: Shared cannot depend on features, router, or app
    if (layer === 'shared') {
      if (
        impLayer === 'features' ||
        impLayer === 'app' ||
        impLayer === 'router'
      ) {
        logViolation(
          normalizedRelPath,
          'Shared Kernel Constraint',
          `The shared infrastructure layer is strictly reusable/agnostic. It cannot import from "${imp}".`
        );
      }
    }

    // Feature Isolation Constraints: A feature cannot import from another feature
    if (layer === 'features') {
      const currentFeature = pathParts[1];

      if (impLayer === 'features' && impFeature !== currentFeature) {
        logViolation(
          normalizedRelPath,
          'Feature Isolation Boundary',
          `Cross-feature boundaries breached! Feature "${currentFeature}" is attempting to import from Feature "${impFeature}" via "${imp}". Compose them in the app/router layer instead.`
        );
      }
    }
  }
}

/**
 * Recursively crawl directories
 */
function crawl(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      crawl(fullPath);
    } else if (stat.isFile() && /\.(ts|tsx|js|jsx|vue|mjs)$/.test(file)) {
      const relativePath = path.relative(ROOT_DIR, fullPath);
      validateFile(fullPath, relativePath);
    }
  }
}

// Run Pipeline
console.info(
  '\x1b[36m%s\x1b[0m',
  '🛡️  Running FAOS Architecture Validation Layer Scan...'
);
if (!fs.existsSync(ROOT_DIR)) {
  console.error(`Source root not found at target context path: ${ROOT_DIR}`);
  process.exit(1);
}

crawl(ROOT_DIR);

if (hasViolations) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    '❌ Architecture enforcement validation checks failed. See violations detailed above. Build blocked.'
  );
  process.exit(1);
} else {
  console.info(
    '\x1b[32m%s\x1b[0m',
    '✅ Architectural boundaries cleanly intact. Feature isolation guaranteed.'
  );
  process.exit(0);
}

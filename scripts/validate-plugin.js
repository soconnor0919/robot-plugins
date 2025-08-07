#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Color output helpers
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function warn(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Plugin schema validation
function validatePlugin(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error(`Plugin file not found: ${pluginPath}`);
  }

  let plugin;
  try {
    plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
  } catch (e) {
    throw new Error(`Invalid JSON syntax: ${e.message}`);
  }

  const errors = [];
  const warnings = [];

  // Required fields validation
  const requiredFields = [
    'robotId',
    'name',
    'platform',
    'version',
    'pluginApiVersion',
    'hriStudioVersion',
    'trustLevel',
    'category'
  ];

  requiredFields.forEach(field => {
    if (!plugin[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Field format validation
  if (plugin.robotId && !/^[a-z0-9-]+$/.test(plugin.robotId)) {
    errors.push('robotId must be lowercase with hyphens only');
  }

  if (plugin.version && !/^\d+\.\d+\.\d+/.test(plugin.version)) {
    errors.push('version must follow semantic versioning (e.g., 1.0.0)');
  }

  if (plugin.trustLevel && !['official', 'verified', 'community'].includes(plugin.trustLevel)) {
    errors.push(`Invalid trustLevel: ${plugin.trustLevel}. Must be: official, verified, or community`);
  }

  // Category validation
  const validCategories = [
    'mobile-robot',
    'humanoid-robot',
    'manipulator',
    'drone',
    'sensor-platform',
    'simulation'
  ];

  if (plugin.category && !validCategories.includes(plugin.category)) {
    errors.push(`Invalid category: ${plugin.category}. Valid categories: ${validCategories.join(', ')}`);
  }

  // Actions validation
  if (!plugin.actions || !Array.isArray(plugin.actions)) {
    errors.push('Plugin must have an actions array');
  } else if (plugin.actions.length === 0) {
    warnings.push('Plugin has no actions defined');
  } else {
    plugin.actions.forEach((action, index) => {
      const actionErrors = validateAction(action, index);
      errors.push(...actionErrors);
    });
  }

  // Assets validation
  if (plugin.assets) {
    if (!plugin.assets.thumbnailUrl) {
      errors.push('assets.thumbnailUrl is required');
    }

    // Check if asset paths exist
    const assetChecks = [
      ['thumbnailUrl', plugin.assets.thumbnailUrl],
      ['main image', plugin.assets.images?.main],
      ['logo', plugin.assets.images?.logo]
    ];

    if (plugin.assets.images?.angles) {
      Object.entries(plugin.assets.images.angles).forEach(([angle, assetPath]) => {
        assetChecks.push([`${angle} angle`, assetPath]);
      });
    }

    assetChecks.forEach(([description, assetPath]) => {
      if (assetPath && assetPath.startsWith('assets/')) {
        const fullPath = path.resolve(path.dirname(pluginPath), '..', assetPath);
        if (!fs.existsSync(fullPath)) {
          warnings.push(`Asset not found: ${description} (${assetPath})`);
        }
      }
    });
  } else {
    errors.push('Plugin must have assets definition');
  }

  // Manufacturer validation
  if (!plugin.manufacturer?.name) {
    warnings.push('manufacturer.name is recommended');
  }

  return { errors, warnings, plugin };
}

function validateAction(action, index) {
  const errors = [];

  // Required action fields
  const requiredFields = ['id', 'name', 'category', 'parameterSchema'];
  requiredFields.forEach(field => {
    if (!action[field]) {
      errors.push(`Action ${index}: missing required field '${field}'`);
    }
  });

  // Action ID format
  if (action.id && !/^[a-z_]+$/.test(action.id)) {
    errors.push(`Action ${index}: id must be snake_case (lowercase with underscores)`);
  }

  // Action category validation
  const validActionCategories = ['movement', 'interaction', 'sensors', 'logic'];
  if (action.category && !validActionCategories.includes(action.category)) {
    errors.push(`Action ${index}: invalid category '${action.category}'. Valid: ${validActionCategories.join(', ')}`);
  }

  // Parameter schema validation
  if (action.parameterSchema) {
    if (action.parameterSchema.type !== 'object') {
      errors.push(`Action ${index}: parameterSchema.type must be 'object'`);
    }

    if (!action.parameterSchema.properties) {
      errors.push(`Action ${index}: parameterSchema must have properties`);
    }

    if (!Array.isArray(action.parameterSchema.required)) {
      errors.push(`Action ${index}: parameterSchema.required must be an array`);
    }
  }

  // Communication protocol validation
  const hasRos2 = action.ros2;
  const hasNaoqi = action.naoqi;
  const hasRestApi = action.restApi;

  if (!hasRos2 && !hasNaoqi && !hasRestApi) {
    errors.push(`Action ${index}: must have at least one communication protocol (ros2, naoqi, or restApi)`);
  }

  return errors;
}

// Repository validation
function validateRepository() {
  const repoPath = path.resolve('repository.json');

  if (!fs.existsSync(repoPath)) {
    throw new Error('repository.json not found');
  }

  let repo;
  try {
    repo = JSON.parse(fs.readFileSync(repoPath, 'utf8'));
  } catch (e) {
    throw new Error(`Invalid repository.json: ${e.message}`);
  }

  const errors = [];
  const warnings = [];

  // Required repository fields
  const requiredFields = ['id', 'name', 'apiVersion', 'pluginApiVersion', 'trust'];
  requiredFields.forEach(field => {
    if (!repo[field]) {
      errors.push(`Missing required repository field: ${field}`);
    }
  });

  // Validate plugin count
  const indexPath = path.resolve('plugins/index.json');
  if (fs.existsSync(indexPath)) {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const actualCount = index.length;
    const reportedCount = repo.stats?.plugins || 0;

    if (actualCount !== reportedCount) {
      errors.push(`Plugin count mismatch: reported ${reportedCount}, actual ${actualCount}`);
    }
  }

  return { errors, warnings, repo };
}

// Update plugin index
function updateIndex() {
  const pluginsDir = path.resolve('plugins');
  const indexPath = path.join(pluginsDir, 'index.json');

  if (!fs.existsSync(pluginsDir)) {
    throw new Error('plugins directory not found');
  }

  const pluginFiles = fs.readdirSync(pluginsDir)
    .filter(file => file.endsWith('.json') && file !== 'index.json')
    .sort();

  fs.writeFileSync(indexPath, JSON.stringify(pluginFiles, null, 2));
  success(`Updated index.json with ${pluginFiles.length} plugins`);

  // Update repository stats
  const repoPath = path.resolve('repository.json');
  if (fs.existsSync(repoPath)) {
    const repo = JSON.parse(fs.readFileSync(repoPath, 'utf8'));
    repo.stats = repo.stats || {};
    repo.stats.plugins = pluginFiles.length;
    fs.writeFileSync(repoPath, JSON.stringify(repo, null, 2));
    success(`Updated repository stats: ${pluginFiles.length} plugins`);
  }
}

// Main CLI
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'validate':
        const pluginPath = args[1];
        if (!pluginPath) {
          error('Usage: validate <plugin-file>');
          process.exit(1);
        }

        info(`Validating plugin: ${pluginPath}`);
        const { errors, warnings } = validatePlugin(pluginPath);

        if (errors.length > 0) {
          error('Validation failed:');
          errors.forEach(err => console.log(`  - ${err}`));
        }

        if (warnings.length > 0) {
          warn('Warnings:');
          warnings.forEach(warn => console.log(`  - ${warn}`));
        }

        if (errors.length === 0) {
          success('Plugin validation passed!');
          if (warnings.length === 0) {
            success('No warnings found');
          }
        } else {
          process.exit(1);
        }
        break;

      case 'validate-all':
        info('Validating all plugins...');

        // Validate repository
        const repoResult = validateRepository();
        if (repoResult.errors.length > 0) {
          error('Repository validation failed:');
          repoResult.errors.forEach(err => console.log(`  - ${err}`));
          process.exit(1);
        }

        // Validate all plugins
        const indexPath = path.resolve('plugins/index.json');
        if (!fs.existsSync(indexPath)) {
          error('plugins/index.json not found');
          process.exit(1);
        }

        const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
        let allValid = true;

        for (const pluginFile of index) {
          const pluginPath = path.resolve('plugins', pluginFile);
          try {
            const { errors } = validatePlugin(pluginPath);
            if (errors.length > 0) {
              error(`${pluginFile}: ${errors.length} errors`);
              errors.forEach(err => console.log(`    - ${err}`));
              allValid = false;
            } else {
              success(`${pluginFile}: valid`);
            }
          } catch (e) {
            error(`${pluginFile}: ${e.message}`);
            allValid = false;
          }
        }

        if (allValid) {
          success('All plugins are valid!');
        } else {
          process.exit(1);
        }
        break;

      case 'update-index':
        info('Updating plugin index...');
        updateIndex();
        break;

      case 'help':
      default:
        console.log(`
HRIStudio Plugin Validator

Usage:
  validate <plugin-file>    Validate a single plugin file
  validate-all             Validate all plugins and repository
  update-index            Update plugins/index.json with all plugin files
  help                    Show this help message

Examples:
  ./scripts/validate-plugin.js validate plugins/my-robot.json
  ./scripts/validate-plugin.js validate-all
  ./scripts/validate-plugin.js update-index
        `);
        break;
    }
  } catch (e) {
    error(`Error: ${e.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validatePlugin,
  validateRepository,
  updateIndex
};

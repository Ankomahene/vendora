// This script updates import statements from old paths to new services paths
const fs = require('fs');
const path = require('path');

// List of files to update
const filesToUpdate = [
  'app/dashboard/seller-onboarding/page.tsx',
  'app/admin/layout.tsx',
  'app/admin/sellers/[userId]/page.tsx',
  'app/auth/signup/SignupForm.tsx',
  'app/auth/reset-password/ResetPasswordForm.tsx',
  'app/auth/new-password/NewPasswordForm.tsx',
  'app/auth/login/LoginForm.tsx',
];

// Mapping of old imports to new imports
const importMappings = {
  '@/lib/api': {
    getUserProfile: '@/services/profile',
    getDashboardStats: '@/services/profile',
    getSellerProfile: '@/services/seller',
    getAllSellers: '@/services/seller',
    updateSellerStatus: '@/services/admin',
    updateUserProfile: '@/services/profile',
  },
  '@/lib/auth': {
    signUpUser: '@/services/auth',
    verifyOtp: '@/services/auth',
    signInUser: '@/services/auth',
    signOutUser: '@/services/auth',
    requestPasswordReset: '@/services/auth',
    updatePassword: '@/services/auth',
    getUserProfile: '@/services/profile',
    updateUserProfile: '@/services/profile',
  },
};

// Function to update imports in a file
function updateImports(filePath) {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let updated = false;

  // Process each old import path
  Object.entries(importMappings).forEach(([oldPath, functions]) => {
    // Create a regex to match imports from this old path
    const regex = new RegExp(
      `import\\s*{\\s*([^}]*)\\s*}\\s*from\\s*['"]${oldPath}['"]`,
      'g'
    );

    // Replace matched imports
    content = content.replace(regex, (match, importedFunctions) => {
      // Split the imported functions
      const imports = importedFunctions.split(',').map((imp) => imp.trim());

      // Group imports by their new paths
      const newImportGroups = {};

      imports.forEach((imp) => {
        // Handle "functionName as aliasName" case
        const [name, alias] = imp.split(/\s+as\s+/).map((part) => part.trim());

        // Find which new path this function should go to
        for (const [funcName, newPath] of Object.entries(functions)) {
          if (name === funcName) {
            newImportGroups[newPath] = newImportGroups[newPath] || [];
            newImportGroups[newPath].push(alias ? `${name} as ${alias}` : name);
            break;
          }
        }
      });

      // Generate new import statements
      const newImports = Object.entries(newImportGroups)
        .map(
          ([newPath, funcs]) =>
            `import { ${funcs.join(', ')} } from '${newPath}';`
        )
        .join('\n');

      updated = true;
      return newImports;
    });
  });

  if (updated) {
    fs.writeFileSync(fullPath, content);
    console.log(`Updated imports in ${filePath}`);
  } else {
    console.log(`No imports to update in ${filePath}`);
  }
}

// Process all files
filesToUpdate.forEach(updateImports);
console.log('Import updates completed!');

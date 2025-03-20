import * as fs from 'fs';
import * as path from 'path';

const OLD_NAME = 'language-quest';
const NEW_NAME = 'fabletongue';
const OLD_BRAND = 'Language Quest';
const NEW_BRAND = 'FableTongue';

interface FileUpdate {
  path: string;
  oldContent: string;
  newContent: string;
}

const updates: FileUpdate[] = [];

function updatePackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageLockPath = path.join(process.cwd(), 'package-lock.json');

  const updatePackageFile = (filePath: string) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = content
      .replace(/"name": "language-quest"/, `"name": "${NEW_NAME}"`)
      .replace(/"Language Quest"/, `"${NEW_BRAND}"`);
    
    updates.push({
      path: filePath,
      oldContent: content,
      newContent: updated
    });
  };

  updatePackageFile(packagePath);
  if (fs.existsSync(packageLockPath)) {
    updatePackageFile(packageLockPath);
  }
}

function updateSourceFiles(dir: string) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      updateSourceFiles(filePath);
      return;
    }

    const ext = path.extname(file);
    if (!['.ts', '.tsx', '.js', '.jsx', '.md', '.json'].includes(ext)) {
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const updated = content
      .replace(/language-quest/g, NEW_NAME)
      .replace(/Language Quest/g, NEW_BRAND)
      .replace(/LANGUAGE_QUEST/g, 'FABLETONGUE');

    if (content !== updated) {
      updates.push({
        path: filePath,
        oldContent: content,
        newContent: updated
      });
    }
  });
}

function updateEnvironmentFiles() {
  const envFiles = ['.env', '.env.example', '.env.development', '.env.production'];
  
  envFiles.forEach(envFile => {
    const filePath = path.join(process.cwd(), envFile);
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf8');
    const updated = content.replace(/LANGUAGE_QUEST_/g, 'FABLETONGUE_');

    if (content !== updated) {
      updates.push({
        path: filePath,
        oldContent: content,
        newContent: updated
      });
    }
  });
}

function applyUpdates() {
  updates.forEach(update => {
    fs.writeFileSync(update.path, update.newContent, 'utf8');
    console.log(`Updated: ${update.path}`);
  });
}

function createBackup() {
  const backupDir = path.join(process.cwd(), 'backup-pre-rebrand');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  updates.forEach(update => {
    const relativePath = path.relative(process.cwd(), update.path);
    const backupPath = path.join(backupDir, relativePath);
    const backupDirPath = path.dirname(backupPath);

    if (!fs.existsSync(backupDirPath)) {
      fs.mkdirSync(backupDirPath, { recursive: true });
    }

    fs.writeFileSync(backupPath, update.oldContent, 'utf8');
  });

  console.log(`Backup created in: ${backupDir}`);
}

async function main() {
  try {
    console.log('Starting rebranding migration...');
    
    // Create list of changes
    updatePackageJson();
    updateSourceFiles(process.cwd());
    updateEnvironmentFiles();

    // Create backup
    createBackup();

    // Apply changes
    applyUpdates();

    console.log('Migration completed successfully!');
    console.log(`
Next steps:
1. Review the changes in the backup directory
2. Update any CI/CD configurations
3. Update deployment scripts
4. Update documentation links
5. Test the application thoroughly
`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 
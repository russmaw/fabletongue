import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

class DeploymentChecker {
  private results: CheckResult[] = [];
  private rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  private addResult(name: string, status: 'pass' | 'fail' | 'warn', message: string) {
    this.results.push({ name, status, message });
  }

  private readJsonFile(filePath: string) {
    try {
      const content = fs.readFileSync(path.join(this.rootDir, filePath), 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to read ${filePath}: ${error}`);
    }
  }

  private checkFileExists(filePath: string): boolean {
    return fs.existsSync(path.join(this.rootDir, filePath));
  }

  async checkDependencies() {
    try {
      const pkg = this.readJsonFile('package.json');
      
      // Check Expo SDK version
      const expoVersion = pkg.dependencies.expo;
      if (!expoVersion) {
        this.addResult('Expo SDK', 'fail', 'Expo SDK not found in dependencies');
      } else {
        this.addResult('Expo SDK', 'pass', `Found Expo SDK ${expoVersion}`);
      }

      // Check for native dependencies
      const nativeDeps = Object.keys(pkg.dependencies).filter(dep => 
        dep.startsWith('@react-native') || 
        dep.startsWith('react-native-')
      );

      if (nativeDeps.length > 0) {
        this.addResult(
          'Native Dependencies',
          'warn',
          `Found ${nativeDeps.length} native dependencies. Verify Expo compatibility: ${nativeDeps.join(', ')}`
        );
      }

      // Run npm audit
      try {
        execSync('npm audit', { stdio: 'pipe' });
        this.addResult('Security Audit', 'pass', 'No security vulnerabilities found');
      } catch (error) {
        this.addResult('Security Audit', 'warn', 'Security vulnerabilities detected. Run npm audit for details');
      }
    } catch (error) {
      this.addResult('Dependencies', 'fail', `Failed to check dependencies: ${error}`);
    }
  }

  async checkConfiguration() {
    // Check app.json
    if (this.checkFileExists('app.json')) {
      try {
        const appConfig = this.readJsonFile('app.json');
        const requiredFields = ['name', 'version', 'slug'];
        const missingFields = requiredFields.filter(field => !appConfig.expo[field]);
        
        if (missingFields.length === 0) {
          this.addResult('App Configuration', 'pass', 'app.json is properly configured');
        } else {
          this.addResult(
            'App Configuration',
            'fail',
            `Missing required fields in app.json: ${missingFields.join(', ')}`
          );
        }
      } catch (error) {
        this.addResult('App Configuration', 'fail', `Invalid app.json: ${error}`);
      }
    } else {
      this.addResult('App Configuration', 'fail', 'app.json not found');
    }

    // Check tsconfig.json
    if (this.checkFileExists('tsconfig.json')) {
      try {
        this.readJsonFile('tsconfig.json');
        this.addResult('TypeScript Configuration', 'pass', 'tsconfig.json is valid');
      } catch (error) {
        this.addResult('TypeScript Configuration', 'fail', `Invalid tsconfig.json: ${error}`);
      }
    } else {
      this.addResult('TypeScript Configuration', 'fail', 'tsconfig.json not found');
    }
  }

  async checkAssets() {
    const assetDirs = ['assets', 'assets/images', 'assets/fonts', 'assets/audio'];
    
    for (const dir of assetDirs) {
      if (this.checkFileExists(dir)) {
        const files = fs.readdirSync(path.join(this.rootDir, dir));
        this.addResult(
          `Assets (${dir})`,
          'pass',
          `Found ${files.length} files in ${dir}`
        );
      } else {
        this.addResult(`Assets (${dir})`, 'warn', `Directory ${dir} not found`);
      }
    }

    // Check app.json for asset configuration
    try {
      const appConfig = this.readJsonFile('app.json');
      const { icon, splash, assetBundlePatterns } = appConfig.expo;

      if (!icon) {
        this.addResult('App Icon', 'fail', 'App icon not configured in app.json');
      }
      if (!splash) {
        this.addResult('Splash Screen', 'fail', 'Splash screen not configured in app.json');
      }
      if (!assetBundlePatterns) {
        this.addResult('Asset Patterns', 'warn', 'Asset bundle patterns not configured in app.json');
      }
    } catch (error) {
      this.addResult('Asset Configuration', 'fail', `Failed to check asset configuration: ${error}`);
    }
  }

  async checkTypeScript() {
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      this.addResult('TypeScript', 'pass', 'No TypeScript errors found');
    } catch (error) {
      this.addResult('TypeScript', 'fail', 'TypeScript errors found. Run tsc --noEmit for details');
    }
  }

  async checkEnvironment() {
    // Check for environment files
    const envFiles = ['.env', '.env.development', '.env.production'];
    let foundEnvFile = false;

    for (const file of envFiles) {
      if (this.checkFileExists(file)) {
        foundEnvFile = true;
        this.addResult('Environment', 'pass', `Found environment file: ${file}`);
      }
    }

    if (!foundEnvFile) {
      this.addResult('Environment', 'warn', 'No environment files found');
    }

    // Check for API keys in code
    try {
      const output = execSync('git grep -l "API_KEY\\|SECRET\\|PASSWORD"', { stdio: 'pipe' }).toString();
      if (output) {
        this.addResult(
          'Security',
          'warn',
          'Potential API keys or secrets found in code. Please verify they are properly secured'
        );
      }
    } catch (error) {
      // git grep returns exit code 1 if no matches found, which is good
      this.addResult('Security', 'pass', 'No API keys or secrets found in code');
    }
  }

  async checkNavigation() {
    const navFiles = [
      'src/navigation/AppNavigator.tsx',
      'src/navigation/index.ts',
      'src/navigation/types.ts'
    ];

    for (const file of navFiles) {
      if (this.checkFileExists(file)) {
        this.addResult('Navigation', 'pass', `Found navigation file: ${file}`);
      } else {
        this.addResult('Navigation', 'warn', `Missing navigation file: ${file}`);
      }
    }
  }

  async checkStateManagement() {
    const storeFiles = [
      'src/store/index.ts',
      'src/store/types.ts',
      'src/store/actions.ts'
    ];

    for (const file of storeFiles) {
      if (this.checkFileExists(file)) {
        this.addResult('State Management', 'pass', `Found store file: ${file}`);
      } else {
        this.addResult('State Management', 'warn', `Missing store file: ${file}`);
      }
    }
  }

  async runAllChecks() {
    console.log(chalk.blue('🔍 Starting deployment checks...\n'));

    await this.checkDependencies();
    await this.checkConfiguration();
    await this.checkAssets();
    await this.checkTypeScript();
    await this.checkEnvironment();
    await this.checkNavigation();
    await this.checkStateManagement();

    this.printResults();
  }

  private printResults() {
    console.log(chalk.blue('\n📊 Check Results:\n'));

    const passes = this.results.filter(r => r.status === 'pass').length;
    const warnings = this.results.filter(r => r.status === 'warn').length;
    const failures = this.results.filter(r => r.status === 'fail').length;

    this.results.forEach(({ name, status, message }) => {
      const icon = status === 'pass' ? '✅' : status === 'warn' ? '⚠️' : '❌';
      const color = status === 'pass' ? chalk.green : status === 'warn' ? chalk.yellow : chalk.red;
      console.log(`${icon} ${color(name)}`);
      console.log(`   ${message}\n`);
    });

    console.log(chalk.blue('\n📈 Summary:'));
    console.log(chalk.green(`✅ Passed: ${passes}`));
    console.log(chalk.yellow(`⚠️ Warnings: ${warnings}`));
    console.log(chalk.red(`❌ Failures: ${failures}`));

    if (failures > 0) {
      console.log(chalk.red('\n❌ Some checks failed. Please fix these issues before deploying.'));
      process.exit(1);
    } else if (warnings > 0) {
      console.log(chalk.yellow('\n⚠️ Some checks generated warnings. Please review before deploying.'));
    } else {
      console.log(chalk.green('\n✅ All checks passed! Ready for deployment.'));
    }
  }
}

// Run the checks
const checker = new DeploymentChecker(process.cwd());
checker.runAllChecks().catch(error => {
  console.error(chalk.red('Error running checks:', error));
  process.exit(1);
}); 
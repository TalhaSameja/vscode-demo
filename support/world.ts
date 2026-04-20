import { World as CucumberWorld, setWorldConstructor } from '@cucumber/cucumber';
import { _electron as electron, ElectronApplication, Page } from 'playwright-core';
import { TerminalPage } from '../pages/TerminalPage';
import { EditorPage } from '../pages/EditorPage';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export class VSCodeWorld extends CucumberWorld {
  app!: ElectronApplication;
  window!: Page;
  terminalPage!: TerminalPage;
  editorPage!: EditorPage;
  testWorkspace: string;

  constructor(options: any) {
    super(options);
    this.testWorkspace = path.join(__dirname, '..', 'test-workspace');
  }

  async launchVSCode(): Promise<void> {
    // Kill any leftover VS Code instances for a fresh start
    try {
      execSync('taskkill /f /im Code.exe', { stdio: 'ignore' });
      await new Promise(r => setTimeout(r, 3000));
    } catch {
      // No VS Code running — that's fine
    }

    // Ensure workspace exists and is clean
    if (!fs.existsSync(this.testWorkspace)) {
      fs.mkdirSync(this.testWorkspace, { recursive: true });
    }
    const demoFile = path.join(this.testWorkspace, 'demo.js');
    if (fs.existsSync(demoFile)) {
      fs.unlinkSync(demoFile);
    }

    // Find VS Code executable
    const userAppPath = path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Microsoft VS Code', 'Code.exe');
    const systemAppPath = 'C:\\Program Files\\Microsoft VS Code\\Code.exe';
    let executablePath = userAppPath;
    if (!fs.existsSync(userAppPath) && fs.existsSync(systemAppPath)) {
      executablePath = systemAppPath;
    }
    if (!fs.existsSync(executablePath)) {
      throw new Error(`VS Code not found at ${userAppPath} or ${systemAppPath}`);
    }

    // Launch a fresh VS Code instance
    this.app = await electron.launch({
      executablePath,
      args: [
        this.testWorkspace,
        '--user-data-dir=' + path.join(__dirname, '..', 'vscodedata'),
        '--no-sandbox',
        '--disable-updates',
        '--skip-welcome',
        '--skip-release-notes',
        '--disable-workspace-trust',
        '--disable-extensions'
      ]
    });

    this.window = await this.app.firstWindow();
    const workbench = this.window.locator('.monaco-workbench');
    await workbench.waitFor({ state: 'visible', timeout: 30000 });
    await workbench.click();

    // Initialize page objects
    this.terminalPage = new TerminalPage(this.window);
    this.editorPage = new EditorPage(this.window);
  }

  async closeVSCode(): Promise<void> {
    if (this.app) {
      await this.app.close();
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

setWorldConstructor(VSCodeWorld);

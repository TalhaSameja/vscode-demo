import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TerminalPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openTerminal(): Promise<void> {
    await this.pressKeys('Control+`');
    const terminal = this.page.locator('.terminal-wrapper');
    await expect(terminal).toBeVisible({ timeout: 10000 });
    await this.waitFor(1000);
  }

  async runCommand(command: string): Promise<void> {
    await this.typeText(command, 30);
    await this.pressKeys('Enter');
    await this.waitFor(2000);
  }

  async createFile(fileName: string): Promise<void> {
    await this.runCommand(`echo console.log("initial") > ${fileName}`);
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.runCommand(`del ${fileName}`);
  }
}

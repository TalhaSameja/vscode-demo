import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditorPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openFile(fileName: string): Promise<void> {
    // Use Quick Open (Ctrl+P) to find and open the file
    await this.pressKeys('Control+P');
    await this.typeText(fileName);
    await this.waitFor(1000);
    await this.pressKeys('Enter');

    // Verify the file is open by checking the window title
    await expect(this.page).toHaveTitle(new RegExp(fileName, 'i'), { timeout: 15000 });
  }

  async writeAndSave(code: string): Promise<void> {
    // Click the editor area to ensure focus
    const editor = this.page.locator('.monaco-editor').first();
    await editor.click();
    await this.waitFor(500);

    // Select all existing content and replace
    await this.pressKeys('Control+A');
    await this.pressKeys('Backspace');

    // Type the new code
    await this.typeText(code, 30);

    // Save the file
    await this.pressKeys('Control+S');
    await this.waitFor(1000);
  }
}

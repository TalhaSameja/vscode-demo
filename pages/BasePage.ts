import { Page } from 'playwright-core';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitFor(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  async pressKeys(keys: string): Promise<void> {
    await this.page.keyboard.press(keys);
  }

  async typeText(text: string, delay: number = 30): Promise<void> {
    await this.page.keyboard.type(text, { delay });
  }
}

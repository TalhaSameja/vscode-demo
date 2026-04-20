import { Given, When, Then } from '@cucumber/cucumber';
import { VSCodeWorld } from '../support/world';
import * as fs from 'fs';
import * as path from 'path';
import { expect } from '@playwright/test';

Given('VS Code is launched with a clean workspace', { timeout: 60000 }, async function (this: VSCodeWorld) {
  // VS Code is already launched by the Before hook
  // Verify the workbench is visible
  const workbench = this.window.locator('.monaco-workbench');
  await expect(workbench).toBeVisible();
});

When('I create a new file {string} via the terminal', { timeout: 30000 }, async function (this: VSCodeWorld, fileName: string) {
  await this.terminalPage.openTerminal();
  await this.terminalPage.createFile(fileName);
});

When('I open {string} in the editor', { timeout: 30000 }, async function (this: VSCodeWorld, fileName: string) {
  await this.editorPage.openFile(fileName);
});

When('I write {string} in the editor and save', { timeout: 30000 }, async function (this: VSCodeWorld, code: string) {
  await this.editorPage.writeAndSave(code);
});

When('I run {string} in the terminal', { timeout: 30000 }, async function (this: VSCodeWorld, command: string) {
  // Focus terminal first
  await this.terminalPage.openTerminal();
  await this.terminalPage.runCommand(command);
});

Then('I delete {string} via the terminal', { timeout: 30000 }, async function (this: VSCodeWorld, fileName: string) {
  await this.terminalPage.deleteFile(fileName);
});

Then('{string} should not exist on disk', { timeout: 10000 }, async function (this: VSCodeWorld, fileName: string) {
  const filePath = path.join(this.testWorkspace, fileName);
  expect(fs.existsSync(filePath)).toBe(false);
});

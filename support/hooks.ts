import { Before, After } from '@cucumber/cucumber';
import { VSCodeWorld } from './world';

Before({ timeout: 60000 }, async function (this: VSCodeWorld) {
  await this.launchVSCode();
});

After({ timeout: 60000 }, async function (this: VSCodeWorld) {
  await this.closeVSCode();
});

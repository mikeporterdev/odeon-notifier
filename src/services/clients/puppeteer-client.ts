import { Browser, Page } from 'puppeteer';
import * as puppeteer from 'puppeteer';

export class PuppeteerClient {
  private browser: Browser;

  public async runOnPage<T>(callbackFn: (page: Page) => Promise<T>): Promise<T> {
    if (!this.browser?.isConnected()) {
      await this.browser?.close();
      this.browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });
    }

    const page = await this.browser.newPage();

    const response = await callbackFn(page);

    await page.close();
    return response;
  }
}

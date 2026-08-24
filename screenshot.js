const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  fs.mkdirSync('screenshots', { recursive: true });

  const browser = await chromium.launch({ headless: true });

  const pages = [
    {
      url: 'https://traveltalkmedia.com.au/',
      name: 'homepage'
    },
    {
      url: 'https://traveltalkmedia.com.au/quiz/',
      name: 'quiz'
    }
  ];

  const today = new Date().toISOString().slice(0, 10);

  for (const item of pages) {

    const page = await browser.newPage({
      viewport: { width: 1440, height: 1200 }
    });

    console.log(`Opening ${item.url}`);

    await page.goto(item.url, {
      waitUntil: 'domcontentloaded',
      timeout: 120000
    });

    // Allow dynamic content and images to start loading
    await page.waitForTimeout(10000);

    // Slowly scroll down the page to trigger lazy-loaded images
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 600;

        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;

          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 300);
      });
    });

    // Give newly loaded images a moment to render
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: `screenshots/traveltalk-${item.name}-${today}.png`,
      fullPage: true
    });

    console.log(`Saved ${item.name} screenshot`);

    await page.close();
  }

  await browser.close();
})();

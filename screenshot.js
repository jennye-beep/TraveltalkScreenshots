const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  fs.mkdirSync('screenshots', { recursive: true });

  const browser = await chromium.launch({ headless: true });

  const today = new Date().toISOString().slice(0, 10);

  // -----------------------------
  // HOMEPAGE - MULTIPLE SCREENSHOTS
  // -----------------------------

  const homepage = await browser.newPage({
    viewport: { width: 1440, height: 1200 }
  });

  console.log('Opening homepage');

  await homepage.goto('https://traveltalkmedia.com.au/', {
    waitUntil: 'domcontentloaded',
    timeout: 120000
  });

  // Allow ads, images and dynamic content to load
  await homepage.waitForTimeout(10000);

  // Scroll through the page to trigger lazy-loaded images
  await homepage.evaluate(async () => {
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

  await homepage.waitForTimeout(3000);

  // Take 4 homepage screenshots, 6 seconds apart
  for (let i = 1; i <= 4; i++) {
    const number = String(i).padStart(2, '0');

    await homepage.screenshot({
      path: `screenshots/traveltalk-homepage-${today}-${number}.png`,
      fullPage: true
    });

    console.log(`Saved homepage screenshot ${number}`);

    if (i < 4) {
      await homepage.waitForTimeout(6000);
    }
  }

  await homepage.close();

  // -----------------------------
  // QUIZ PAGE - SINGLE SCREENSHOT
  // -----------------------------

  const quiz = await browser.newPage({
    viewport: { width: 1440, height: 1200 }
  });

  console.log('Opening quiz page');

  await quiz.goto('https://traveltalkmedia.com.au/quiz/', {
    waitUntil: 'domcontentloaded',
    timeout: 120000
  });

  await quiz.waitForTimeout(10000);

  // Scroll through quiz page to trigger lazy-loaded images
  await quiz.evaluate(async () => {
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

  await quiz.waitForTimeout(3000);

  await quiz.screenshot({
    path: `screenshots/traveltalk-quiz-${today}.png`,
    fullPage: true
  });

  console.log('Saved quiz screenshot');

  await quiz.close();

  await browser.close();
})();

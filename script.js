// With Bright Data
const puppeteer = require('puppeteer-core');
const AUTH = 'brd-customer-hl_c2fce8f9-zone-amazonn:voux502jmae6';
const SBR_WS_ENDPOINT = `wss://${AUTH}@brd.superproxy.io:9222`;


async function run() {
  browser = await puppeteer.connect({ browserWSEndpoint: SBR_WS_ENDPOINT });

  try {
    const page = await browser.newPage();

    // Navigate to Amazon
    await page.goto('https://www.amazon.com/', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Search for a specific item
    await page.type('#twotabsearchtextbox', 'laptop'); // Modify this to your desired search term
    await page.click('#nav-search-submit-button');

    // Wait for the search results
    await page.waitForSelector('.s-main-slot', { timeout: 5000 });

    // Extract data
    const results = await page.evaluate(() => {
      const items = document.querySelectorAll('.s-result-item');
      const data = [];

      items.forEach((item) => {
        const title = item.querySelector('h2 span').innerText;
        const price = item.querySelector('.a-offscreen').innerText;
        data.push({ title, price });
      });

      return data;
    });

    // Display the results
    console.log(results);
  } catch (error) {
    console.error('Error during execution:', error);
  } finally {
    // Close the browser
    if (browser) {
      await browser.close();
    }
  }
}

// Call the run function
run();
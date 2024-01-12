const puppeteer = require("puppeteer");
const ExcelJS = require('exceljs');

const scrapeWebsite = async (baseUrl) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the URL
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

    const links = [];

    
    while (true) {
      const linkSelector = '.pointer.text-decoration-none.fas.fa-globe';
      const nextButtonSelector = '.pager-right-next.pager-item.pager-right';

      // Wait for the link selector to appear on the page
      const pageLinks = await page.$$eval(linkSelector, (links) => links.map((link) => link.href));

      // Add the links to the array
      links.push(...pageLinks);
    console.log(links);
      // Save the links to the Excel sheet or perform any desired task
      saveLinksToExcel(links);

      // Wait for the next button selector to appear on the page
      const [button] = await page.$$(nextButtonSelector);

      // If the button is not found, break out of the loop
      if (!button) {
        break;
      }

      // Click on the second element
      await button.click();

      // You can add a delay if needed
      await page.waitForTimeout(1000);
    }

    console.log('Scraping successful. Links saved to links.xlsx');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
};

// Function to save the links to Excel (you can customize this function)
const saveLinksToExcel = (links) => {
  // Implement your logic to save the links to Excel here
  // Example using ExcelJS:
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Links');
  links.forEach((link) => {
    sheet.addRow([link]);
  });
  workbook.xlsx.writeFile('links.xlsx');
};

// Example usage
const baseUrl = 'https://cosmoprof2023.smallworldlabs.com/exhibitors#exhibitor-list';
scrapeWebsite(baseUrl);

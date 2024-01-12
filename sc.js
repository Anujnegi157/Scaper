const puppeteer = require("puppeteer");
const ExcelJS = require('exceljs');

const scrapeWebsite = async (baseUrl) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

    const links = [];

    
    while (true) {
      const linkSelector = '.pointer.text-decoration-none.fas.fa-globe';
      const nextButtonSelector = '.pager-right-next.pager-item.pager-right';

      
      const pageLinks = await page.$$eval(linkSelector, (links) => links.map((link) => link.href));

      
      links.push(...pageLinks);
    console.log(links);
     
      saveLinksToExcel(links);

      
      const [button] = await page.$$(nextButtonSelector);

     
      if (!button) {
        break;
      }

      
      await button.click();

    
      await page.waitForTimeout(1000);
    }

    console.log('Scraping successful. Links saved to links.xlsx');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
};


const saveLinksToExcel = (links) => {
 
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Links');
  links.forEach((link) => {
    sheet.addRow([link]);
  });
  workbook.xlsx.writeFile('links.xlsx');
};


const baseUrl = 'https://cosmoprof2023.smallworldlabs.com/exhibitors#exhibitor-list';
scrapeWebsite(baseUrl);

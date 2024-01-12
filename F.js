const puppeteer = require("puppeteer");
const ExcelJS = require('exceljs');

// const app = express();
// const PORT = 3000;

const scrapeWebsite = async (baseUrl) => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  try {
    // Navigate to the URL
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

    // Extract links from all pages
    let links = [];
    let hasNextPage = true;

    
    // ...

while (hasNextPage) {
  console.log('Navigating to the next page...');
  await page.waitForSelector('.pointer.text-decoration-none.fas.fa-globe');

  // Extract links on the current page
  // ...

  // Check if there is a next page
  hasNextPage = await page.evaluate(() => {
    const nextPageButton = document.querySelectorAll('.pager-right-next.pager-item.pager-right')[1];
    return nextPageButton !== null && !nextPageButton.classList.contains('pager-item-disabled');
  });

  console.log('Next page available:', hasNextPage);

  // Navigate to the next page if available
  if (hasNextPage) {
    const nextPageButton = await page.$$('.pager-right-next.pager-item.pager-right');
    await nextPageButton[1].click();
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  }
}

// ...


    // Create an Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Links');

    // Add all links to the worksheet
    worksheet.columns = [
      { header: 'Links', key: 'link' },
    ];

    links.forEach((link) => {
      worksheet.addRow({ link });
    });

    // Save the Excel file
    const excelFileName = 'links.xlsx';
    await workbook.xlsx.writeFile(excelFileName);

    console.log('Scraping successful. Links saved to links.xlsx');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
};

// ...


// Example usage
const baseUrl = 'https://cosmoprof2023.smallworldlabs.com/exhibitors#exhibitor-list'; 

scrapeWebsite(baseUrl);


// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
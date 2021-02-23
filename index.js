const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const target = process.argv[2];

const main = async () => {
  if (!target) {
    console.log(`😭 Please type funds name `);
    return;
  }

  const targetUpper = target.toUpperCase();
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("http://codequiz.azurewebsites.net/");
  await page.click("input[type=button]");
  await page.screenshot({ path: "captionScreen.png" });

  const content = await page.content();
  const $ = cheerio.load(content, { normalizeWhitespace: true });

  let fundList = {};

  $("table tr").each((_, element) => {
    let prevColumn = "";
    const dom = $(element).children("td");
    dom.each((index, tdElement) => {
      if (index === 0) {
        const nameFund = $(tdElement).text().trim();
        fundList[nameFund] = [];
        prevColumn = nameFund;
      } else {
        fundList[prevColumn].push($(tdElement).text().trim());
      }
    });
  });

  if (fundList[targetUpper] && fundList[targetUpper][0]) {
    console.log(`✅ Nav :`, fundList[targetUpper][0]);
  } else {
    console.log(`⛔️ Not Found with ${targetUpper}`);
  }
  await browser.close();
};

main();

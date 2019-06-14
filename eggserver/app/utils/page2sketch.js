const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function transform(url) {
  console.log("hello, this is transform url function!");
  console.log("url: ", url);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(url, { waitUntil: "networkidle2" });
  const websiteTitle = await page.$eval("title", e => e.innerHTML);
  const filename = websiteTitle + "-" + Date.now();
  //screenshot module
  await page.screenshot({
    path: path.resolve(__dirname, "../public/screenshot/", filename + ".jpg"),
    fullPage: true,
    type: "jpeg",
    quality: 60
  });
  // pdf module
  // await page.pdf({
  //     path: 'public/pdf/hn.pdf',
  //     format: 'A4'
  // });
  //asketch module
  await page.addScriptTag({
    path: "app/utils/page2layers.bundle.js"
  });
  const asketchPageJSONString = await page.evaluate(
    "JSON.stringify(page2layers.run())"
  );
  const writePath = path.resolve(
    __dirname,
    "../public/asketch/",
    filename + ".json"
  );
  fs.writeFileSync(writePath, asketchPageJSONString);

  browser.close();
  return { websiteTitle, filename };
}

module.exports = transform;

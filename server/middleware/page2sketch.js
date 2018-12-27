const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function transform(url, filename) {
    console.log("hello, this is transform test!");
    console.log("url: ", url);
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 800});    
    await page.goto(url, {waitUntil: 'networkidle2'});
    //screenshot module
    // await page.screenshot({
    //     path: 'public/images/example.jpg', 
    //     fullPage: true,
    //     type: 'jpeg',
    //     quality: 100
    // });
    //pdf module
    // await page.pdf({
    //     path: 'public/pdf/hn.pdf', 
    //     format: 'A4'
    // });
    //asketch module
    await page.addScriptTag({
        path: 'build/page2layers.bundle.js'
    });
    const asketchPageJSONString = await page.evaluate('JSON.stringify(page2layers.run())');
    const writePath = path.resolve(__dirname, '../public/',filename+'.json'); 
    fs.writeFileSync(writePath, asketchPageJSONString);

    browser.close();
}

module.exports = transform;
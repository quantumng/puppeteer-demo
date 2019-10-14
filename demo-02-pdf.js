const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.jingyu.com/chapter/LaGjDBS0MnW6Ow.html', {
    waitUntil: 'networkidle2'
  });
  await page.waitFor(1000);
  await page.pdf({path: './jingyu.pdf'});

  await browser.close();
})();
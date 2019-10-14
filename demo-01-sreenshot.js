const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // 设置视口属性
  await page.setViewport({
    width: 1200,
    height: 480,
  });
  await page.goto('https://www.jingyu.com');
  await page.screenshot({path: './jingyu.png'});
  await browser.close();
})();
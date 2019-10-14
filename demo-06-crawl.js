const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://m.jingyu.com')
    browser.close()
  } catch (error) {
      console.log(error)
  }
})()
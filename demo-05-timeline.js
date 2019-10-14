const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

(async () => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // 生成 iPhone 6 模拟器
    await page.emulate(iPhone)
    await page.tracing.start({
      path: './demo-05/trace.json'
    })
    await page.goto('https://m.jingyu.com')
    await page.tracing.stop()
    browser.close()
  } catch (error) {
      console.log(error)
  }
})()
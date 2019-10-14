const fs = require('fs');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const BASE_URL = 'https://m.jingyu.com';
const iPhone = devices['iPhone 6'];

// 收集章节数据，并执行点击下一章节操作
async function clickNext(page, chapters) {
  const chapterContent = await page.evaluate(() => {
    const $ = window.$
    const $subscribeBtn = $('.subscribe-btn')
    // 如果页面出现“登录后继续阅读”的按钮，则停止收集数据
    if ($subscribeBtn && $subscribeBtn.text() === '登录后继续阅读') {
      return Promise.resolve(false)
    }
    const $chapterContent = $('.js-chapterContent')
    const key = $chapterContent.data('cid')
    const content = {}
    content[key] = $chapterContent.html()
    return Promise.resolve(content)
  })
  if (!chapterContent) {
    return Promise.resolve()
  }
  chapters = Object.assign(chapters, chapterContent);
  const nextBtn = await page.$('div.js-next-chapter.js-clickable');
  await Promise.all([
    page.waitForNavigation(),
    nextBtn.tap()
  ])
  await page.waitForSelector('.chapter-info');
  await page.waitFor(2000)
  await clickNext(page, chapters)
}

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    // 生成 iPhone 6 模拟器
    await page.emulate(iPhone);

    // 进入鲸鱼网
    await page.goto(BASE_URL, {
      waitUntil: "networkidle0"
    });
    await page.waitForSelector('.simple-books');
    
    // 选择一本书，点击进入详情页面
    const book = await page.$('.js-clickable a');
    await Promise.all([
      page.waitForNavigation(),
      book.click()
    ]);
    await page.waitForSelector('.book-info');
    // 获取章节URL
    let link = await page.evaluate(host => {
      const $ = window.$
      const cid = $('.js-go-read').data('url')
      return Promise.resolve(host + cid)
    }, BASE_URL);

    // 进入阅读器页面
    await page.goto(link, {
      waitUntil: "networkidle0"
    });
    await page.waitForSelector('.chapter-info');
    // 收集所有章节数据
    let chapters = {}
    await clickNext(page, chapters)
    await page.waitFor(5000)
    browser.close();
    // 将爬到的数据写到json文件里
    writerStream = fs.createWriteStream('./demo-06/data.json');
    writerStream.write(JSON.stringify(chapters, undefined, 2), 'UTF8');
    writerStream.end();
  } catch (error) {
      console.log(error);
  }
})()
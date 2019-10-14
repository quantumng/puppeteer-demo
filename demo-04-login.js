const puppeteer = require('puppeteer')

const url = 'https://weibo.com'
// 从启动脚本中获取账户和密码
const USER = process.argv[2];
const PASSWORD = process.argv[3];

if (!USER || !PASSWORD) {
  console.log('invalid user or password');
  process.exit();
}

login(USER, PASSWORD)

async function login(userName, password) {
  if (!userName) {
    throw new Error('请输入用户名');
  }
  if (!password) {
    throw new Error('请输入密码');
  }
  try {
    // 使用无头模式，并设置视图大小
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport:{
        height: 1080,
        width: 1920
      }
    })

    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle2'
    })

    // 等待登录框出现
    await page.waitForSelector('#pl_login_form')
    // 来到微博主页，拍个照留念
    await page.screenshot({
      path: './demo-04/weibo-index.png'
    })

    // 输入用户名
    const name = await page.$('#loginname')
    await name.type(userName, {
      delay: 200
    })
    // 输入密码
    const pwd = await page.$('input.W_input[type="password"]')
    await pwd.type(password, {
      delay: 200
    })
    // 输入完账户密码，拍个照留念
    await page.screenshot({
      path:'./demo-04/weibo-input.png'
    })

    // 点击登录，等待跳转到微博主页内容出现
    const btn = await page.$('.W_unlogin_v4 .W_login_form .login_btn .W_btn_a')
    await Promise.all([
      page.waitForNavigation(), // 等待导航跳转结束
      btn.click(), // 点击登录按钮导航跳转
    ])
    // 微博内容页面出现啦，拍个照留念
    await page.screenshot({
      path: './demo-04/weibo-content.png'
    })
    // 停留片刻，关闭浏览器
    await page.waitFor(3000)
    await browser.close()
  } catch (error) {
    console.log(error)
  }
}

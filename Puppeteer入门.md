# Puppeteer入门

![puppeteer](C:\Users\wxq\Desktop\puppeteer.png)

## Puppeteer简介

Puppeteer 是一个 Node 库，它提供了一个高级 API 来通过 [DevTools 协议]( https://chromedevtools.github.io/devtools-protocol/ )控制 Chromium 或 Chrome。Puppeteer 默认以 headless 模式运行，但是可以通过修改配置文件运行“有头”模式。

> 1. puppeteer的中文意思是，操作木偶的人。
> 2. DevTool 协议 基于 WebSocket，利用 WebSocket 实现与浏览器内核的快速数据通道，分为多个域（DOM，Debugger，Network，Profiler，Console...），每个域中都定义了相关的命令和事件（Commands and Events），我们可以基于DevTool 协议封装一些工具对 Chrome 浏览器进行调试及分析，比如我们常用的 “Chrome 开发者工具” 就是基于 CDP 实现的。
> 3. Headless模式: 在无界面的环境中运行 Chrome，通过命令行或者程序语言操作 Chrome。

**它能做什么？**

你可以在浏览器中手动执行的绝大多数操作都可以使用 Puppeteer 来完成！ 下面是一些示例：

* 生成页面截图或PDF；
* 抓取 SPA（单页应用）并生成预渲染内容（即“SSR”（服务器端渲染））。
* 自动提交表单，进行 UI 测试，键盘输入等。
* 创建一个时时更新的自动化测试环境。使用最新的 JavaScript 和浏览器功能直接在最新版本的Chrome中执行测试。
* 捕获网站的 timeline trace，用来帮助分析性能问题。
* 测试浏览器扩展。



## Puppeteer上手

**安装**

```javascript
npm i puppeteer
# or "yarn add puppeteer"
```

安装过程中，默认会下载最近版本的Chromium，以保证可以使用API。

**使用**

Puppeteer 至少需要 Node v6.4.0，下面的示例使用 async / await，它们仅在 Node v7.6.0 或更高版本中被支持。

Puppeteer 使用起来和其他测试框架类似。你需要创建一个 Browser 实例，打开页面，然后使用 Puppeteer 的 API。

**Demo-01**  屏幕截图

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({path: 'example.png'});

  await browser.close();
})();
```

**Demo-02**  生成PDF

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://news.ycombinator.com', {waitUntil: 'networkidle2'});
  await page.pdf({path: 'hn.pdf', format: 'A4'});

  await browser.close();
})();
```

**Demo-03**  获取页面规格信息

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  console.log('Dimensions:', dimensions);

  await browser.close();
})();
```



## 常用API

Puppeteer API 是分层次的，反映了浏览器结构。

![](C:\Users\wxq\Desktop\40333229-5df5480c-5d0c-11e8-83cb-c3e371de7374.png)



* **Browser**：对应一个浏览器实例，一个 Browser 可以包含多个 BrowserContext；
* **BrowserContext**：对应浏览器一个上下文会话，就像我们打开一个普通的 Chrome 之后又打开一个隐身模式的浏览器一样，BrowserContext 具有独立的 Session(cookie 和 cache 独立不共享)，一个BrowserContext 可以包含多个 Page；
* **Page**：表示一个 Tab 页面，通过 browserContext.newPage()/browser.newPage() 创建，browser.newPage() 创建页面时会使用默认的 BrowserContext，一个 Page 可以包含多个 Frame；
* **Frame**: 一个框架，每个页面有一个主框架（page.MainFrame()）,也可以多个子框架，主要由 iframe 标签创建产生的；
* **ExecutionContext**： 是 javascript 的执行环境，每一个 Frame 都一个默认的 javascript 执行环境；
* **ElementHandle**: 对应 DOM 的一个元素节点，通过该该实例可以实现对元素的点击，填写表单等行为，我们可以通过选择器，xPath 等来获取对应的元素；
* **JsHandle**：对应 DOM 中的 javascript 对象，ElementHandle 继承于 JsHandle，由于我们无法直接操作 DOM 中对象，所以封装成 JsHandle 来实现相关功能；
* **CDPSession**：可以直接与原生的 CDP 进行通信，通过 session.send 函数直接发消息，通过 session.on 接收消息，可以实现 Puppeteer API 中没有涉及的功能；
* **Coverage**：获取 JavaScript 和 CSS 代码覆盖率；
* **Tracing**：抓取性能数据进行分析；
* **Response**： 页面收到的响应；
* **Request**： 页面发出的请求

### Puppeteer

Puppeteer 模块提供了一种启动 Chromium 实例的方法。

**方法：**

* puppeteer.connect(options)：将 Puppeteer 添加到已有的 Chromium 实例
* puppeteer.launch([options])：创建一个 Browser 类的实例



### Browser

当 Puppeteer 连接到一个 Chromium 实例的时候会通过 puppeteer.launch 或 puppeteer.connect 创建一个 Browser 对象。

**事件：**

* browser.on('disconnected')
* browser.on('targetchanged')
* browser.on('targetcreated')
* browser.on('targetdestroyed')

**方法：**

* browser.close()：关闭 Chromium 及其所有页面(如果页面被打开的话)。
* browser.newPage()：返回一个新的 Page 对象。Page 在一个默认的浏览器上下文中被创建。



### Page

Page 提供操作一个 tab 页或者 extension background page 的方法。一个 Browser 实例可以有多个 Page 实例。

事件：

* page.on('close')
* page.on('console')
* page.on('dialog')
* page.on('domcontentloaded')
* page.on('error')
* page.on('frameattached')
* page.on('framedetached')
* page.on('framenavigated')
* page.on('load')
* page.on('metrics')
* page.on('pageerror')
* page.on('request')
* page.on('requestfailed')
* page.on('requestfinished')
* page.on('response')
* page.on('workercreated')
* page.on('workerdestroyed')

方法：

* page.$(selector)：此方法在页面内执行 document.querySelector
* page.$$(selector)：此方法在页面内执行 document.querySelectorAll
* page.$$eval(selector, pageFunction[, ...args])：此方法在页面内执行 Array.from(document.querySelectorAll(selector))，然后把匹配到的元素数组作为第一个参数传给 pageFunction。
* page.$eval(selector, pageFunction[, ...args])：此方法在页面内执行 document.querySelector，然后把匹配到的元素作为第一个参数传给 pageFunction。
* page.$x(expression)：此方法解析指定的XPath表达式
* page.click(selector[, options])：此方法找到一个匹配 selector 选择器的元素，如果需要会把此元素滚动到可视，然后通过 page.mouse 点击它；
* page.content()： 返回页面的完整 html 代码，包括 doctype。
* page.emulate(options)：根据指定的参数和 user agent 生成模拟器。
* page.evaluate(pageFunction[, ...args])： 相当于创建了当前页面的控制台环境
* page.goto(url[, options])：导航到某个地址
* page.pdf([options])： 生成PDF文件 
* page.screenshot([options])：截图
* page.tap(selector)：点击屏幕
* page.type(selector, text[, options])：输入内容
* page.waitFor(selectorOrFunctionOrTimeout[, options[, ...args]])：等待某个元素出现或超时时间
* page.waitForNavigation([options])：等待链接跳转
* page.waitForSelector(selector[, options])：等待选择器的某个元素出现



## 牛刀小试

尝试简介里提到的一些示例场景

### 自动提交表单

```javascript
// 这里以登录新浪微博为例
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

```

### Timeline Trace

```javascript
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
```

### 爬个虫？

```javascript
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
```



## 参考资料

> 谷歌开发者文档：[https://developers.google.com/web/tools/puppeteer](https://developers.google.com/web/tools/puppeteer)
>
> Puppeteer官方文档：[英文原版](https://pptr.dev/)、[中文翻译](https://zhaoqize.github.io/puppeteer-api-zh_CN/)
>
> 蚂蚁金服数据体验技术：[无头浏览器 Puppeteer 初探](https://juejin.im/post/59e5a86c51882578bf185dba)
>
> zhangdianp：[结合项目来谈谈 Puppeteer](https://juejin.im/post/5d4059305188255d38489a8c)




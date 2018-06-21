var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var puppeteer = require('puppeteer');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(80, function() {
    console.log('App listening at port 80;');
    newPageCall();
});

async function newPageCall(){

    var caller = 90000;
    var callee = 95000;

    const browser = await puppeteer.launch(
        {args:[
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
            '--no-sandbox'
        ],headless:false}
    );
    const browserAnswer = await puppeteer.launch(
        {args:[
            '--use-fake-device-for-media-stream',
            '--use-fake-ui-for-media-stream',
            '--no-sandbox'
        ],headless:false}
    );
    try {
        for (var i = 0;i<1;i++) {

            const page = await browser.newPage();
            console.log('打开页面');
            await page.goto('https://agent-dev.cticloud.cn/webrtc/demo.html');
            // 监听页面内部的console消息
            page.on('console', msg => {console.dir(msg)});
            console.log('键入主叫');
            await page.type('#user', (caller+i).toString());
            console.log('主叫注册');
            await page.click('#register');
            await page.type('#number',(callee+i).toString());

            const pageAnswer = await browserAnswer.newPage();
            console.log('打开页面');
            await pageAnswer.goto('https://agent-dev.cticloud.cn/webrtc/demo1.html');
            console.log('键入被叫');
            await pageAnswer.type('#user', (callee+i).toString());
            console.log('被叫注册');
            await pageAnswer.click('#register');

            console.log('点击呼叫');
            await page.click('#call');
            await sleep();
            console.log('点击应答');
            await pageAnswer.click('#answer');
        }
    } catch (e) {
        throw e
    }

}

let sleep = () => {
    return new Promise((resolve,reject)=>{
            setTimeout(() => {
            resolve(3);
        },3000)
    })
}

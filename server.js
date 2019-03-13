const Koa = require('koa');
const KoaBody = require('koa-body');
const KoaStatic = require('koa-static');
const KoaMount = require('koa-mount');
const app = new Koa();

// 加载post请求参数中间件
app.use(KoaBody({multipart: true}));
// 可访问的目录
app.use(KoaMount('/static/public', KoaStatic(__dirname + '/static/public')));

const response = require('./src/middleware/response');
const cookie = require('./src/middleware/cookie');

// 加载路由
const router = require('./src/router/index');

app.use(response);
// app.use(cookie);

app.use(router.routes());

const renderer = require('vue-server-renderer').createRenderer({
    template: require('fs').readFileSync('./index.html', 'utf-8')
});
const context = {
    title: 'hello',
    meta: `<meta charset="UTF-8">`
};
const createApp = require('./app');

app.use( async(ctx) => {
    const app = createApp({url: ctx.request.url});

    renderer.renderToString(app, context, (err, html) => {
        // html 将是注入应用程序内容的完整页面
        // return html;
        ctx.body = html;
    })
});

app.listen(8080);




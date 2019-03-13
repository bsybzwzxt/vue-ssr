module.exports = async function (ctx, next) {
    /** 也许比此中间件更外层的中间件已经返回数据 */
    if (ctx.body) {
        return;
    }

    /** 看看命中的路由是否已经设置返回数据 */
    if (ctx.respond === false) {
        return;
    }

    /** 不想通过此中间件处理返回数据 */
    if (ctx.skipAutoHandleResponseData) {
        return;
    }

    let data;
    let err;
    try {
        data = await next();
    } catch (e) {
        err = e;
    }

    if (ctx.body) {
        return;
    }

    /** 也许 http 头部数据已发送出去，就不处理了 */
    if (ctx.headerSent) {
        console.log('Headers have already been sent');
        if (err) {
            console.error('Catch an error but not handle:', err);
        }
        return;
    }

    /** 检测有没有匹配路由 */
    if (!err && !data && !(ctx.matched && ctx.matched.length && ctx.matched.some(l => ~l.methods.indexOf(ctx.request.method)))) {
        return;
    }

    if (!err) {
        ctx.body = {status: 1, data: data};
    } else {
        switch (Object.prototype.toString.call(err)) {
            case '[object String]':
                ctx.body = {status: 0, errCode: 500, errMsg: err};
                break;
            case '[object Object]':
                ctx.body = Object.assign({status: 0}, err);
                break;
            case '[object Error]':
                ctx.body = {status: 0, errCode: 500, errMsg: err.message || 'Error'};
                break;
            default:
                ctx.body = {status: 0, errCode: 500, errMsg: '服务器繁忙，请稍后重试'};
                break;
        }
    }

};
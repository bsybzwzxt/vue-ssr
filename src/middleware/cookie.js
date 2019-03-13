const {filterRouter, decryption} = require('../utils/test');

module.exports = async function (ctx, next) {

    if (filterRouter(['/api/user/login', '/api/user/register'], ctx.request.url)) {
        return next();
    }

    let token = ctx.cookies.get('token');
    if (!token) {
        throw {errCode: 401, errMsg: '用户未登陆'};
    }
    let key = decryption(token);
    if (Date.now() > key.split('&')[1]) {
        throw {errCode: 401, errMsg: '用户授权过期'};
    }
    ctx.state.user = key.split('&')[0];
    return next();
};
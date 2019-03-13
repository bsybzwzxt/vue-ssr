const KoaRouter = require('koa-router');
const router = new KoaRouter();
const User = require('../model/user');
const {encryption} = require('../utils/test');

router.post('/api/user/login', async (ctx) => {
    let data = await User.findOne(ctx.request.body);

    if (data) {
        let token = data.account + "&" + (Date.now() + 86400000);
        const hash = encryption(token);

        ctx.cookies.set('token', hash);
        return {account: data.account};
    } else {
        throw new Error('用户名或密码错误');
    }
});

router.post('/api/user/register', async (ctx) => {
    let {account, password} = ctx.request.body;
    if (!/^[a-zA-Z0-9]{4,12}$/.test(account)) {
        throw new Error('账号为4到12位的字母或数字');
    }
    if (!/^[a-zA-Z0-9]{4,12}$/.test(password)) {
        throw new Error('密码为4到12位的字母或数字');
    }
    try {
        await User.create(ctx.request.body);
        return {msg: '注册成功'}
    } catch (err) {
        if (err.code === 11000) {
            throw {errCode: err.code, errMsg: '用户名已被注册'};
        } else {
            throw new Error();
        }
    }
});

router.post('/api/user/logout', async (ctx) => {
    ctx.cookies.set('token', undefined);
    return {result: 1}
});

router.post('/api/user/info', async (ctx) => {
    return await User.findOne({
        account: ctx.state.user
    });
});

router.post('/api/user/changepassword', async (ctx) => {
    let {oldPassword, newPassword} = ctx.request.body;
    let data = await User.findOne({
        account: ctx.state.user,
        password: oldPassword
    });
    if (data) {
        if (!/^[a-zA-Z0-9]{4,12}$/.test(newPassword)) {
            throw new Error('密码为4到12位的字母或数字');
        }
        await User.update({account: ctx.state.user, password: oldPassword}, {password: newPassword});
        return {result: 1}
    } else {
        throw new Error('用户名或密码错误');
    }
});

module.exports = router;
var express = require('express');
var router = express.Router();
//操作数据库
var User = require('../models/User');
//定义统一的返回格式
var responseData={};
router.use(function(req,res,next){
    responseData={
        code:0,
        message:''
    };
    next();
});
///用户注册
/*
* 注册逻辑
* 1.用户名不能为空，
* 2.密码不能为空
* 3.两次输入密码一致
* 4.用户名是否已经被注册
* **/
router.post('/user/register',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    //用户名是否为空
    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空！';
        //把数据对象转成json返回给前端
        res.json(responseData);
        return;
    }
    //密码不能为空
    if(password == ''){
        responseData.code = 1;
        responseData.message = '密码不能为空！';
        res.json(responseData);
        return;
    }
    //两次输入的密码必须致
    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致！';
        res.json(responseData);
        return;
    }
    //用户名不能重复，如果数据库中已存在，表示该用户已被注册
    User.findOne({
        username:username
    }).then(function (userInfo) {
        //如果存在说明数据库中有记录
        if(userInfo){
            responseData.code =4;
            responseData.message='用户名已存在';
            res.json(responseData);
            return;
        }
        //保存注册的信息到数据库中
        var user = new User({
            username:username,
            password:password
        });
        return user.save();
    }).then(function (newUserInfo) {
        //注册成功
        responseData.message = '注册成功！';
        res.json(responseData);
    });
});
//登录
router.post('/user/login',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    if(username=='' || password==''){
        responseData.code=1;
        responseData.message = '用户名及密码不能为空！';
        res.json(responseData);
        return
    }
    //到数据库中查询怕端数据库中是否存在及密码是否一致，如果存在登录
    User.findOne({
        username:username,
        password:password
    }).then(function(userinfo){
        if(!userinfo){
            responseData.code=2;
            responseData.message = '用户或密码错误！';
            res.json(responseData);
            return
        }
        responseData.message = '登陆成功！';
        responseData.userInfo = {
            id:userinfo.id,
            username:userinfo.username
        };
        req.cookies.set('userInfo',JSON.stringify({
            id:userinfo.id,
            username:userinfo.username
        }));
        res.json(responseData);
        return
    })
});
//退出
router.get('/user/logout',function (req,res) {
    req.cookies.set('userInfo',null);
    responseData.message = '退出成功！';
    res.json(responseData);
    return
});
module.exports = router;
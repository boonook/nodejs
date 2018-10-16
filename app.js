/**
 *应用程序的启动 入口文件
 * */
///加载express模块
var express = require('express');
///加载模板处理模块
var swig = require('swig');
///加载数据库
var mongoose = require('mongoose');
//加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser');
//加载cookies模块
var Cookies = require('cookies');
///创建app的应用 =>nodeJs http.createServer()
var app = express();
///设置静态文件托管
//当用户访问的url以/public开始，那么知己返回对应__dirname+'/public'下的文件
app.use('/public',express.static(__dirname+'/public'));
///配置应用模板
/*
* 定义当前应用所使用的模板引擎
* 第一个参数：末班引擎的名称，同事也是模板文件的后缀
* 第二个参数表示用于解析处理模板的内容的方法
* */
app.engine('html',swig.renderFile);
///设置模板文件存放的目录，第一个参数必须是views,第二个参数是目录
app.set('views','./views');
///注册所使用的模板引擎，第一个参数必须是view engine，第二个参数和///设置模板文件存放的目录,第一个参数必须是views,第二个参数是目录app.engine('html',swig.renderFile);中的第一个参数一致
app.set('view engine','html');
//开发过程中取消模板的缓存机制,模范情况下cache位true
swig.setDefaults({cache:false});
/*
* 首页
*
* req request对象
*
* res response 对象
*
* next 函数
* */
// app.get('/',function(req,res,next){
//     //res.send('<h1>欢迎来到boonook的博客</h1>')
//     //读取views目录下的指定文件，解析并返回个客户端
//     /*
//     * 第一个参数：表示模板的文件，相对于views目录views/html
//     * 第二个参数：传递给模板所使用的数据
//     * */
//     res.render('index.html');
// });
//bodyParser设置,这样我们就可以通过请求回调中的req拿到参数
app.use(bodyParser.urlencoded({extended:true}));
//设置cookies
app.use(function(req,res,next){
    req.cookies =  new Cookies(req,res);
    //解析登录用户的信息
    req.userInfo = {};
    //判断cookie是否存在，如果存在说明用户应经登陆，如果不存在说明用户还哦没有登录需要登录
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
        }catch (e){

        }
    }
    next();
});
/*
* 根基不同的功能划分模块
* */
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));
///链接mongodb数据库
mongoose.connect('mongodb://localhost:27018/localhost',function(err){
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        app.listen(8081);
    }
});
///监听http请求
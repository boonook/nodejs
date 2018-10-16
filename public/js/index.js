$(function(){
   var login = $('#login');
   var registered = $('#registered');
   var logined = $('#logined');
   ///登录显示与隐藏
    login.find('a.loginState').on('click',function(){
       login.hide();
       registered.show();
    });
    ///注册显示与隐藏
    registered.find('a.loginState').on('click',function(){
        login.show();
        registered.hide();
    });
    //注册
    registered.find('button').on('click',function(){
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: registered.find('[name="username"]').val(),
                password: registered.find('[name="password"]').val(),
                repassword:  registered.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function(result) {
                if(result && result.code==0){
                    alert(result.message);
                    setTimeout(function() {
                        login.show();
                        registered.hide();
                    }, 1000);
                }else{
                    registered.find('.error').html(result.message);
                }
            }
        });
    });
    //登录
    login.find('button#loginSubmit').on('click',function(){
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: login.find('[name="username"]').val(),
                password: login.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function(result) {
                if(result && result.code==0){
                    alert(result.message);
                    setTimeout(function() {
                        //重载页面
                        window.location.reload();
                        // //显示用户信息
                        // logined.find('.username').html(result.userInfo.username);
                        // logined.find('.info').html('你好欢迎光临我的博客！');
                    }, 1000);
                }else{
                    login.find('.error').html(result.message);
                }
            }
        });
    });
    //登出
    logined.find('.logout').click(function(){
        $.ajax({
            url: '/api/user/logout',
            success: function(result) {
                if(!result.code){
                    window.location.reload()
                }
            }
        });
    })
});
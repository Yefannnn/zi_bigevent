//在每次调用ajax请求之前会自动调用 $.ajaxPrefilter
//在这个函数中我们可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (option) {
    //option是我们配置的ajax
    option.url = 'http://www.liulongbin.top:3007' + option.url
    //如果发现请求的url地址中有/my/路径，说明这个路径需要提供token这个身份认证信息
    if (option.url.indexOf('/my/') !== -1) {
        //确定访问需要权限之后
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //每次请求的时候，都调用complete方法，每次都去验证一下用户的身份是否合法，如果合法就放行，如果不合法就强制清空token值并且跳转到登录页面
    option.complete =  function(res) {
        //拿到服务器返回的数据responseJSON ，用responseJSON来判断用户是否强制登录，如果身份验证失败，就强制将页面跳转到登录页面
        if (res.responseJSON.status === 1 || res.responseJSON.message === '身份认证失败!') {
            console.log('验证失败了');
            //一旦请求的时候发现用户身份验证失败，就强制清空token值并且强制跳转
            localStorage.removeItem('token')
            location.href = '../../login.html'
        }

    }

})
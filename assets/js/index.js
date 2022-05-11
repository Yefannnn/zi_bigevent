$(function () {

    getuserinfo()


    //点击退出
    $('#logo_out').on('click', function () {
        // console.log(1111);
        layer.confirm('确定退出嘛?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //删除本地存储
            localStorage.removeItem('token')
            //跳转首页
            location.href = '../../login.html'

            layer.close(index)
        });
    })
})


//请求用户的身份信息
function getuserinfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success(res) {
            console.log(res);
            layer = layui.layer
            //判断是否请求成功
            if (res.status !== 0) return layui.layer.msg('登录失败')
            layui.layer.msg('登录成功')
            getavator(res)
        },
        // complete(res) { 
        //     //拿到服务器返回的数据responseJSON ，用responseJSON来判断用户是否强制登录，如果身份验证失败，就强制将页面跳转到登录页面
        //     if (res.responseJSON.status === 1 ||  res.responseJSON.message === '身份认证失败!') {
        //         console.log('验证失败了');
        //         //一旦请求的时候发现用户身份验证失败，就强制清空token值并且强制跳转
        //         localStorage.removeItem('token')
        //         location.href = '../../login.html'
        //     }
        // }
    })
}

//获取用户头像模块
function getavator(res) {
    //展示用户名
    let username = res.data.nickname || res.data.username
    // console.log(username);
    $('.welcome').html(`欢迎 ${username}`)
    // $('.welcome').html(`欢迎 ${nickname}`)
    //成功登录后，判断用户是否有头像
    if (res.user_pic == null) {
        //没有头像
        let first = username[0].toUpperCase()
        $('.text-avator').show()
        $('.avator').hide()
        $('.text-avator').html(first)

    } else {
        //有头像
        $('.avator').prop('src', res.data.user_pic)
        $('.text-avator').hide()
    }
}
$(function () {
    //控制主页的链接跳转
    $('#link_login').on('click', function () {

        $('.reg_box').show()
        $('.login_box').hide()
    })
    $('#link_reg').on('click', function () {
        $('.reg_box').hide()
        $('.login_box').show()
    })

    //验证密码
    //从layui中form的对象
    let form = layui.form
    let layer = layui.layer
    //通过form.verify 函数自定义校验规则
    form.verify({
        //自定义一个叫做 pass 的表单验证规则
        psd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //确认两次密码输入是否相同
        //这个形参就是这个密码框的值
        repsd: function (revalue) {
            // let revalue = $('#repsd').val()
            let value = $('#psd').val()
            if (value !== revalue) {
                return '两次密码不一致'
            }
        }
    })

    //注册提交
    //监听表单的提交事件
    $('#form_reg').on('submit', function (e) {
        //阻止默认跳转行为
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#username_reg').val(),
                password: $('#psd').val()
            },
            success(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(`${res.message}请登录`)
                $('#link_reg').click()
            }
        })
    })

    //登录提交
    //监听表单的提交行为，阻止默认的提交行为
    $('#form_login').on('submit', function (e) {
        //先阻止默认的提交
        e.preventDefault()
        //发送客户端请求
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success(res) {
                console.log(res);
                if (!res.status == 0) return layer.msg(res.message)
                localStorage.setItem('token', res.token)
                location.href = '../../index.html'
            }
        })
    })

})
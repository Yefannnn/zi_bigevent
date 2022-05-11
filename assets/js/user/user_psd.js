$(function () {
    //匹配正则
    let layer = layui.layer
    let form = layui.form
    form.verify({
        psd: [/^[\S]{6,12}$/, '密码6~12位,且不能有空格'],
        newPsd: function (value) {
            //原密码和新密码不能一样
            $('[name=psd]').val()
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样'
            }
        },
        repsd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入不一致'
            }
        }

    })

    //发起ajax请求
    $('.layui-form').on('submit', function (e) {
        //阻止默认行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success(res) {
                console.log(res);
                if ( res.status !== 0) {
                    return layer.msg('密码修改失败')
                }
                layer.msg('密码修改成功')
                $('.layui-form')[0].reset()
            }

        })
    })
})
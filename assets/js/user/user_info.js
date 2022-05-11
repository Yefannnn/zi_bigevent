$(function () {
    //写入自己的验证规则
    let form = layui.form
    form.verify({
        nickname: function (value) {
            if (!new RegExp(/^[\w]{1,16}$/).test(value)) {
                return '请输入1~6位字符'
            }
            // if (value.length > 6) {
            //     return '请输入 1 - 6 位字符'
            // }
        }
    })

    let layer = layui.layer
    //用户进入个人信息时，发起请求初始化用户信息
    function initUserinfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                layer.msg('获取成功')
                //为表单赋值（把拿到的数据全部渲染到表单中）
                form.val('initUserinfo', res.data)
            }
        })
    }
    initUserinfo()

    //重置模块
    resetbtn.addEventListener('click', function (e) {
        e.preventDefault()
        initUserinfo()
    })

    //提交修改模块
    $('.layui-form').on('submit', function (e) {
        //阻止默认提交
        e.preventDefault()
        //发起 ajax请求，将数据全部发送到指定路径
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success(res) {
                console.log(res);
                if(res.status !== 0) {
                    return layer.msg('本次修改失败')
                }
                layer.msg('修改成功')
                //此时服务器将用户信息进行更新
                //需要重新调用获取信息的接口
                window.parent.getuserinfo()
            }
        })
    })

})
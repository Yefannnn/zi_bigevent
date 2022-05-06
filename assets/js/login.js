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
})
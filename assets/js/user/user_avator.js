$(function () {

    //实例化layer对象
    let layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //为上传按钮添加点击事件
    $('#btnChooseavator').on('click', function () {
        $('#file').click()
    })

    //监听用户是否上传头像
    $('#file').on('change', function (e) {
        if (e.target.files.length <= 0) {
            return layer.msg('请上传头像')
        }
        //拿到用户上传的第一个文件
        let file = e.target.files[0]
        let fileUrl = URL.createObjectURL(file)
        //拿到文件路径之后重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', fileUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //确定按钮绑定点击事件，为上传头像做准备
    $('#btnupload').on('click', function () {
        //点击确定后可以拿到裁剪后的64bit格式的图片地址
        var dataURL = $image
        .cropper('getCroppedCanvas', {
          // 创建一个 Canvas 画布
          width: 100,
          height: 100
        })
        .toDataURL('image/png')

        //发起请求
        $.ajax({
            method:'POST',
            url:'/my/update/avatar',
            data:{
                avator:dataURL
            },
            success(res) {
                console.log(res);
                if ( res.status !== 0) {
                    return layer.msg('更换失败')
                }
                window.parent.getuserinfo()
            }
        })
    })
})
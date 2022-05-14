$(function () {
    let form = layui.form
    //发请求，拿到文章的类别
    getactCate()

    function getactCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章失败！')
                }
                //拿到数据之后，定义模板，并渲染模板
                let htmlStr = template('tpl_cates', res)
                $('[name=act_cates]').html(htmlStr)
                //由于此时页面早已经渲染完毕，所以需要重新调用的话，得再次调用render()函数
                form.render()
            }
        })
    }


    // 调用富文本
    // 初始化富文本编辑器
    initEditor()


    //图片裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //绑定选择按钮，上传图片进行裁剪
    $('#select_btn').on('click', function () {
        $('#files').click()
    })

    //监听文件改变事件
    $('#files').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    //为发布做准备，给按钮绑定点击事件
    let art_status = '已发布'
    $('#btnSave2').on('click', function () {
        art_status = '草稿'
    })

    //为表单绑定提交事件
    $('#act_pubform').on('submit', function (e) {
        //阻止默认提交行为
        e.preventDefault()
        //基于表单，快速创建一个FormData对象
        let fd = new FormData($(this)[0])
        fd.append('state', art_status)

        //将裁剪过后的图片转化成对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            }) 
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '../../../actical/act_list.html'
            }
        })
    }


})
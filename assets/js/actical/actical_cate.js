$(function () {

    let layer = layui.layer
    let form = layui.form
    getActicalcate()
    //发起文章分类的请求
    function getActicalcate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('请求失败')
                }
                let htmlStr = template('tpl_actical', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //为点击按钮添加点击事件
    let addindex = null
    $('#addActicalcate').on('click', function () {
        addindex = layer.open({
            type: 1,
            anim: 6,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#diolog-add').html()
        });
    })
    //点击提交文章分类
    $('body').on('submit', '#add_actical', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                getActicalcate()
                layer.msg('新增分类成功')
                // 关闭弹出层   
                layer.close(addindex)
            }
        })
    })

    //通过代理的方式来给 按钮添加点击事件
    let editindex = null
    $('tbody').on('click', '#edit_btn', function () {
        editindex = layer.open({
            type: 1,
            anim: 6,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#diolog-edit').html()
        });

        // 根据id 获取对应的数据
        let Id = $(this).attr('data-Id')
        // console.log(Id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success(res) {
                console.log(res);
                form.val('edit_actical', res.data)
            }
        })

    })

    //通过代理的方式来给 修改分类的表单 绑定submit事件
    $('body').on('submit', '#edit_actical', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                console.log(res);
                if (res.status !== 0) return leyer.msg('更新失败')
                layer.msg('更新成功')
                layer.close(editindex)
                getActicalcate()
            }
        })
    })

    //通过代理的方式给 删除按钮绑定 点击事件
    let delbtn = null
    $('body').on('click', '#del_btn', function () {
        let id = $(this).attr('data-id')
        delbtn = layer.confirm('确定需要删除嘛?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    layer.close(delbtn);
                    getActicalcate()
                }
            })


        });

    })


})
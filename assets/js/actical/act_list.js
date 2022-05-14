$(function () {

    let laypage = layui.laypage;
    let form = layui.form
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        let time = new Date(data)
        let y = time.getFullYear()
        let m = Padzero(time.getMonth() + 1)
        let d = Padzero(time.getDate())
        let hh = Padzero(time.getHours())
        let mm = Padzero(time.getMinutes())
        let ss = Padzero(time.getSeconds())
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    //补零函数 
    function Padzero(data) {
        return data < 10 ? '0' + data : data
    }


    //配置需要携带的参数
    let q = {
        pagenum: 1, //页码
        pagesize: 2, //每页的个数
        cate_id: '', //文章id
        state: '' //状态
    }

    //发起获取文章列表的请求
    function getactList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                console.log(res);

                layer.msg('获取成功')
                //通过template引擎渲染到页面
                let htmlStr = template('actList', res)
                // console.log(htmlStr);
                $('tbody').html(htmlStr)
                //当列表加载完毕之后，渲染分页，并将筛选中之后的total值传入参数
                renderPage(res.total)
            }
        })
    }
    getactList()

    //发起请求拿到所有的文章
    function getactcate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获得分类数据失败！')
                }
                //调用模板引擎渲染分类的可选项
                let htmlStr = template('actlist', res)
                // console.log(htmlStr);
                $('#cate_id').html(htmlStr)
                //通过 layui 重新渲染表单区域的ui结构
                form.render()
            }
        })
    }
    getactcate()


    //为筛选按钮绑定提交事件
    $('shuai_btn').on('submit', function (e) {
        e.preventDefault()
        //获取两个表单里面的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        //将这两个数据添加到查询对象中去
        q.cate_id = cate_id
        q.state = state
        //将配置好的查询对象重新发起请求并渲染
        getactList()
    })


    //渲染分页的函数
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'page_list', //需要渲染的容器
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条
            curr: q.pagenum, //设置默认被选中的分页
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],

            //触发jump回调函数的两种方式：
            //1、分页发生切换的时候，就会触发jump 回调
            //2、只要调用了laypage这个函数，就会触发
            //所以第一次加载的时候,first 结果是true
            //如果不是第一次加载的话，first的结果是und
            jump(obj, first) {

                q.pagenum = obj.curr

                q.pagesize = obj.limit
                //根据最新的页码进行发起数据
                //判断是否是首次加载
                //首次不执行
                if (!first) {
                    getactList()
                }

            }
        });
    }

    //通过代理的方式，对删除按钮 绑定点击事件
    $('tbody').on('click', '.btn_del', function () {
        //点击之后首先拿到这条数据的id 号。通过id 号来发起删除请求，请求结束之后重新渲染页面数据
        let len = $('.btn_del').length
        console.log(len);
        let id = $(this).attr('data-id')
        console.log(id);
        layer.confirm('确定要删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    //如果只有一个按钮的时候，并且删除之后没有数据的时候让页码-1 后发起请求
                    if (len == 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                        console.log(q);
                        getactList()
                        getactcate()
                    }
                }
            })
            layer.close(index);
        });

    })


})
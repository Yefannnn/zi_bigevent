//在每次调用ajax请求之前会自动调用 $.ajaxPrefilter
//在这个函数中我们可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (option) {
    //option是我们配置的ajax
    option.url = 'http://www.liulongbin.top:3007' + option.url
})
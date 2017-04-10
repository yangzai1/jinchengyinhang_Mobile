define(function(require) {
    function bhLogin() {
        /*属性的定义*/
    }

    bhLogin.prototype = {
        /*方法的定义*/
        uploadSubmit:function(param){
            var othis= this
            $.ajax({
                url: "/login",
                type: "POST",
                dataType: 'json',
                data: param,
                success: function (res) {
                    if (res.code == '0') {
                        window.location.href = "/";
                    } else {
                        layer.msg(res.message+'('+res.reason+')',{shift:-1},function (){
                                othis.getVerCode()
                            }
                        );
                        // history.go()
                    }
                }
            });
        },
        login:function(){
            var othis = this;
            $("#loginForm").validate({
                submitHandler:function(form){
                    if(test()){
                        var param = $("#loginForm").serialize();
                        othis.uploadSubmit(param);
                    }
                },
                rules: {
                    userName: "required",
                    passWord: "required",
                    passWord: {
                        required: true,
                        minlength: 6,
                        maxlength: 32
                    }
                },
                messages: {
                    userName: "请输入用户名",
                    passWord: "请输入密码",
                    passWord: {
                        required: "请输入密码",
                        minlength: "密码最小长度6字符",
                        maxlength:"密码最大长度32字符"
                    }
                }
            });
        },
        getVerCode:function(){
            $('#verifiCodeTip').removeClass('verifiCodeTipTrue').removeClass('verifiCodeTipFalse');
            $('#verifiCode').val('');

            $.ajax({
                url: "/login/getVerCode",
                type: "POST",
                dataType: 'json',
                success: function (res) {
                    if(res.msg == 'ok'){
                        $('#verifiCodeImg').attr('src',res.datas.imgUrl);
                    }else{
                        layer.msg('刷新后重试')
                    }
                }
            });
        }
    }

    var bhlogin = new bhLogin();
    bhlogin.getVerCode();

    $("#doLogin").bind('click',function () {
        bhlogin.login();
    });
    //获取验证码
    $('#verifiCodeImg').live('click', function(){
        bhlogin.getVerCode();
        $('#verifiCode').val('');
        $('#verifiCodeTip').removeClass('verifiCodeTipFalse').removeClass('verifiCodeTipTrue');
    })
    $('#verifiCode').bind('input propertychange',function(){
        $("#doLogin").attr('disabled','disabled');
        if($(this).val().length<4){
            $('#verifiCodeTip').removeClass('verifiCodeTipTrue').addClass('verifiCodeTipFalse');
        }
        if($(this).val().length==4){
            $.ajax({
                url: "/login/checkVerCode",
                type: "POST",
                dataType: 'json',
                data:{checkVerCode:$(this).val()},
                success: function (res) {
                    if(res.code == 0){
                        $('#verifiCodeTip').removeClass('verifiCodeTipFalse').addClass('verifiCodeTipTrue');
                        $("#doLogin").removeAttr('disabled');
                    }else{
                        $('#verifiCodeTip').removeClass('verifiCodeTipTrue').addClass('verifiCodeTipFalse');
                    }
                }
            });
        }
    })
    document.onkeydown = function (e) {
        if (!e)
            e = window.event;
        if ((e.keyCode || e.which) == 13) {
            bhlogin.login();
        }
    }
    $('input[name=userName]').blur(function(){
        if($(this).val().length==0){
            $(this).addClass('error')
            $('#userName-error').show().html('请输入用户名')
        }else{
            var $res = /(^1[34578]\d{9}$)|(^(\w+\.){0,}(\w+)?\@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,6}){1,2}$)/;
            if(!$res.test($(this).val())){
                $(this).addClass('error')
                $('#userName-error').show().html('请输入正确用户名')
            }else{
                $(this).removeClass('error')
                $('#userName-error').hide().html('')
            }
        }
    })

    function test(){
        if($('input[name=userName]').val().length==0){
            $('input[name=userName]').addClass('error')
            $('#userName-error').show().html('请输入用户名')
            return false;
        }else{
            var $res = /(^1[34578]\d{9}$)|(^(\w+\.){0,}(\w+)?\@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,6}){1,2}$)/;
            if(!$res.test($('input[name=userName]').val())){
                $('input[name=userName]').addClass('error')
                $('#userName-error').html('请输入正确用户名').show()
                return false;
            }
            if($('.bhui_login_vertical input').val().length==0){
                layer.msg('请填写验证码')
                return false;
            }
            if($('.bhui_login_vertical input').val().length<4){
                layer.msg('请填写四位验证码')
                return false;
            }
            return true;
        }
    }


    function initAnimate(){
        $('.bhui_login_showImg').css('top','0').css('opacity','1');
        $('.bhui_login_animate_ip1').css('top','20px').css('opacity','1');
        $('.bhui_login_animate_ip2').css('top','70px');
        $('.bhui_login_animate_ip3').css('top','120px');
        $('.bhui_login_subContent').css('top','330px')
    }
    initAnimate()

    function InterAnimate(obj,time){
        this.time = time;
        this.opacity = 0;
        this.obj = obj;
        this.interval;
    }
    InterAnimate.prototype.setInterval = function(){
        var _this = this;
        _this.interval = setInterval(function(){
            _this.opacity += 0.1;
            $(_this.obj).css('opacity',_this.opacity);
            if(parseInt(_this.opacity)==1){
                clearInterval(_this.interval);
            }
        },_this.time)
    }
    var inp2 = new InterAnimate('.bhui_login_animate_ip2',1);
    inp2.setInterval()

    var inp3 = new InterAnimate('.bhui_login_animate_ip3',1.5);
    inp3.setInterval()

    var subMit = new InterAnimate('.bhui_login_subContent',5);
    subMit.setInterval()


    var innerWidth = parseInt(document.documentElement.clientWidth);
    if(innerWidth<1000){
        $('#bhui_contains').css('min-width','0px');
        $('.bhui_regist_bg').css('background','url(/images/v1/images/regist-bg1.png) no-repeat').css('backgroundSize','100% 140%');
    }

});
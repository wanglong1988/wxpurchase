/**
 * Created by Administrator on 2017/12/14.
 */
import {getData, getQueryString, $ajax} from '../fetch/getData'
import {config} from '../config'
// import wx from 'weixin-js-sdk'

const layer = window.layer
const wx = window.wx


function getWxConfig(url,shareTitle, cb){
    $ajax('/free/getWeChatInfo',{url:window.location},function(res){
        if(res.status === '1'){
            var data = res.result;

            sessionStorage.setItem('appId', data.appId);
            sessionStorage.setItem('wxToken', data.signature)
            if(getQueryString('state') == '1'){
                let code = getQueryString('code')
                $ajax('/oauth/getAccessToken', {code}, function(res){
                    if(res.errcode){

                    }else{
                        sessionStorage.setItem('accessinfo', JSON.stringify(res))
                        cb && cb()
                    }
                }, function(res){
                    // throw new Error('error main')
                    layer.open({
                        content: '获取微信信息异常'
                        ,skin: 'msg'
                        ,time: 2
                    });
                })
            } else{
                window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${data.appId}&redirect_uri=`+encodeURIComponent(url)+`&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`
                // window.location.href = `https://activities.sanqimei.com/get-weixin-code.html?appid=${data.appId}&redirect_uri=http%3a%2f%2f192.168.88.204%3a3000%2fwxpurchase%2fwxcenter%2fbuild%2flist%3fstoreId%3d117%26activityId%3d5&scope=snsapi_userinfo&connect_redirect=1&state=1`
            }
            // let accessinfo={
            //     access_token:"5_hc0oj0lU6XhZ71zGMaZ22tNuVP-1_KstT4kQUIfC_i86vNQXfRYXwhUG0IoX3LMXq6x_g0zl1X6iY8l_Aag8wA",
            //     openid:"oiEdy1YKhDrFqWAnog5BH26d4Hag",
            // };
            // sessionStorage.setItem('accessinfo', JSON.stringify(accessinfo))
            //初始化微信配置
            // let data = JSON.parse(sessionStorage.getItem('weChatInfo'));
            wxShareConfig(data.appId, data.timestamp, data.nonceStr, data.signature);
            //分享准备
            wxShareReady(shareTitle, shareTitle + config.shareContent, config.shareLogo);
            // cb();
        }
    })
}

/**yi
 * 初始化微信分享配置
 * @param appId
 * @param timestamp
 * @param nonceStr
 * @param signature
 */
function wxShareConfig(appId, timestamp, nonceStr, signature) {
    wx.config({
        debug: true,
        appId: appId,
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareQZone',
            'openLocation',
            'getLocation'
        ]
    });
    wx.error(function (res) {
        console.log(res.errMsg, 'here wx err');
    });
}


/**
 * 分享准备
 * @param lineLink
 * @param shareTitle
 * @param shareContent
 * @param shareLogo
 */
function wxShareReady(shareTitle, shareContent, shareLogo) {
    wx.ready(function () {
        //获取“分享到朋友圈”
        wx.onMenuShareTimeline({
            title: shareTitle, // 分享标题
            link: config.redirectUri, // 分享链接
            imgUrl: shareLogo, // 分享图标
            success: function (res) {
                // 用户确认分享后执行的回调函数
            },
            cancel: function (res) {
                // 用户取消分享后执行的回调函数
            }
        });

        //获取“分享给朋友”
        wx.onMenuShareAppMessage({
            title: shareTitle, // 分享标题
            desc: shareContent, // 分享描述
            link: config.redirectUri, // 分享链接
            imgUrl: shareLogo, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function (res) {
                // 用户确认分享后执行的回调函数
                alert('分享朋友成功')
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        //获取“分享到QQ”
        wx.onMenuShareQQ({
            title: shareTitle, // 分享标题
            desc: shareContent, // 分享描述
            link: config.redirectUri, // 分享链接
            imgUrl: shareLogo, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        //获取“分享到QQ空间”
        wx.onMenuShareQZone({
            title: shareTitle, // 分享标题
            desc: shareContent, // 分享描述
            link: config.redirectUri, // 分享链接
            imgUrl: shareLogo, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        //获取“分享到腾讯微博”
        wx.onMenuShareWeibo({
            title: shareTitle, // 分享标题
            desc: shareContent, // 分享描述
            link: config.redirectUri, // 分享链接
            imgUrl: shareLogo, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    });
}

export {getWxConfig}
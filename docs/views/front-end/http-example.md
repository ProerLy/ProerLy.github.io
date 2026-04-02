# 实例

## 访问网络资源时 403 错误

访问网络资源时 403 错误，是因为访问的资源被禁止了，或者被服务器拒绝了访问。

**前端在使用 video 标签播放视频时，出现 403 错误**

<img src="/video403.png"/>

**然而直接复制地址，在新窗口打开，却没有任何问题，可以正常访问**
<img src="/video403_ok.png"/>

**而复制链接在新窗口直接打开，请求头中并不会携带 Referer**

<img src="/video403-ok.png"/>

**我们打开控制台，可以看到在项目中打开，数据请求的请求头多了一个 Referer: `http://localhost:3000/**`

<img src="/video403-no.png"/>

## 解决方法

直接在 index.html 文件中添加如下：

```html
<meta name="referrer" content="no-referrer" />
```

在某些情况网站想要控制页面发送给服务器的 referer 信息时，可以使用 referer metadata 参数。

referer 的 metadata 属性可以设置 content 属性值为以下：

```txt
default
never
always
origin
no-referrer

default ：若当前页面使用的是 https 协议，而正要加载资源使用的是普通的 http 协议，则将 http header 中的 referer 置空；

never ：删除 http header 中的 referer，所有从当前页面发起的请求将不会携带 referer；

always ：不改变 http header 中的 referer 的值；

origin ：只发送 origin 部分；

no-referrer：没有referer；
```

## 总结

在遇到 403 错误时，我们可以通过添加 referer metadata 参数来解决问题。

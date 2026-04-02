# 实例

## HTML5 Audio/Video 标签、属性、方法、事件汇总

**audio 基本语法**

src 指定当前播放的音频文件，controls 播放控制器，loop 歌曲循环，autoplay 自动播放 (chrome66 之后被禁止)主流浏览器已经关闭了自动播放，需要 js 触发才行，preload 预加载，如果使用了 autoplay 这个属性 preload 就失效了。

```html
<audio src="xxxx.mp3" controls="controls" loop="loop" autoplay="autoplay">
  您的浏览器不支持html5的audio标签
</audio>
```

**video 基本语法：**

src 源，controls 播放控制器，loop 循环播放，autoplay 自动播放，height，width，宽度和高度，在 Audio 里面不能指定，但是在 Video 里面是可以的，muted 静音，poster 预览图（当视频没有播放或者正在加载时展示给用户的一张图片，为了交互的友好性），preload 预加载，和 autoplay 一块时失效。

```html
<video src="xxxx.mp4" controls="controls" loop="loop" autoplay="autoplay">
  您的浏览器不支持html5的video标签
</video>
```

**HTML 音频/视频 方法**

| 方法           | 描述                                      |
| -------------- | ----------------------------------------- |
| addTextTrack() | 向音频/视频添加新的文本轨道。             |
| canPlayType()  | 检测浏览器是否能播放指定的音频/视频类型。 |
| load()         | 重新加载音频/视频元素。                   |
| play()         | 开始播放音频/视频。                       |
| pause()        | 暂停当前播放的音频/视频。                 |

**HTML 音频/视频属性**

| 属性                | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| audioTracks         | 返回表示可用音频轨道的 AudioTrackList 对象。                 |
| autoplay            | 设置或返回是否在加载完成后随即播放音频/视频。                |
| buffered            | 返回表示音频/视频已缓冲部分的 TimeRanges 对象。              |
| controller          | 返回表示音频/视频当前媒体控制器的 MediaController 对象。     |
| controls            | 设置或返回音频/视频是否显示控件（比如播放/暂停等）。         |
| crossOrigin         | 设置或返回音频/视频的 CORS 设置。                            |
| currentSrc          | 返回当前音频/视频的 URL。                                    |
| currentTime         | 设置或返回音频/视频中的当前播放位置（以秒计）。              |
| defaultMuted        | 设置或返回音频/视频默认是否静音。                            |
| defaultPlaybackRate | 设置或返回音频/视频的默认播放速度。                          |
| duration            | 返回当前音频/视频的长度（以秒计）。                          |
| ended               | 返回音频/视频的播放是否已结束。                              |
| error               | 返回表示音频/视频错误状态的 MediaError 对象。                |
| loop                | 设置或返回音频/视频是否应在结束时重新播放。                  |
| mediaGroup          | 设置或返回音频/视频所属的组合（用于连接多个音频/视频元素）。 |
| muted               | 设置或返回音频/视频是否静音。                                |
| networkState        | 返回音频/视频的当前网络状态。                                |
| paused              | 设置或返回音频/视频是否暂停。                                |
| playbackRate        | 设置或返回音频/视频播放的速度。                              |
| played              | 返回表示音频/视频已播放部分的 TimeRanges 对象。              |
| preload             | 设置或返回音频/视频是否应该在页面加载后进行加载。            |
| readyState          | 返回音频/视频当前的就绪状态。                                |
| seekable            | 返回表示音频/视频可寻址部分的 TimeRanges 对象。              |
| seeking             | 返回用户是否正在音频/视频中进行查找。                        |
| src                 | 设置或返回音频/视频元素的当前来源。                          |
| startDate           | 返回表示当前时间偏移的 Date 对象。                           |
| textTracks          | 返回表示可用文本轨道的 TextTrackList 对象。                  |
| videoTracks         | 返回表示可用视频轨道的 VideoTrackList 对象。                 |
| volume              | 设置或返回音频/视频的音量。                                  |

**HTML 音频/视频 事件**

| 事件           | 描述                                               |
| -------------- | -------------------------------------------------- |
| abort          | 当音频/视频的加载已放弃时触发。                    |
| canplay        | 当浏览器可以开始播放音频/视频时触发。              |
| canplaythrough | 当浏览器可在不因缓冲而停顿的情况下进行播放时触发。 |
| durationchange | 当音频/视频的时长已更改时触发。                    |
| emptied        | 当目前的播放列表为空时触发。                       |
| ended          | 当目前的播放列表已结束时触发。                     |
| error          | 当在音频/视频加载期间发生错误时触发。              |
| loadeddata     | 当浏览器已加载音频/视频的当前帧时触发。            |
| loadedmetadata | 当浏览器已加载音频/视频的元数据时触发。            |
| loadstart      | 当浏览器开始查找音频/视频时触发。                  |
| pause          | 当音频/视频已暂停时触发。                          |
| play           | 当音频/视频已开始或不再暂停时触发。                |
| playing        | 当音频/视频在因缓冲而暂停或停止后已就绪时触发。    |
| progress       | 当浏览器正在下载音频/视频时触发。                  |
| ratechange     | 当音频/视频的播放速度已更改时触发。                |
| seeked         | 当用户已移动/跳跃到音频/视频中的新位置时触发。     |
| seeking        | 当用户开始移动/跳跃到音频/视频中的新位置时触发。   |
| stalled        | 当浏览器尝试获取媒体数据，但数据不可用时触发。     |
| suspend        | 当浏览器刻意不获取媒体数据时触发。                 |
| timeupdate     | 当目前的播放位置已更改时触发。                     |
| volumechange   | 当音量已更改时触发。                               |
| waiting        | 当视频由于需要缓冲下一帧而停止时触发。             |

**示例代码**

添加音频

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <audio controls autoplay loop muted>
      <source src="./media/music.mp3" />
      <source src="./media/music.ogg" />
    </audio>
  </body>
</html>
```

添加视频

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- 
        controls:控制播放暂停的按钮 
        autoplay:自动播放
        loop:无限循环
        muted:静音
		poster:视频封面
    -->
    <video
      width="500"
      height="300"
      controls
      loop
      autoplay
      muted
      poster="./media/rt.jpg"
    >
      <source src="./media/explore_promo.mp4" />
      <source src="./media/video.mp4" />
    </video>
  </body>
</html>
```

效果演示：

<img src="/05ac46599a6e5c7fe0e00a1da45b2c64.png"/>

js 代码

```javascript
//错误状态
Media.error; //null:正常
Media.error.code; //1.用户终止 2.网络错误 3.解码错误 4.URL无效

//网络状态
Media.currentSrc; //返回当前资源的URL
Media.src = value; //返回或设置当前资源的URL
Media.canPlayType(type); //是否能播放某种格式的资源
Media.networkState; //0.此元素未初始化  1.正常但没有使用网络  2.正在下载数据  3.没有找到资源
Media.load(); //重新加载src指定的资源
Media.buffered; //返回已缓冲区域，TimeRanges
Media.preload; //none:不预载 metadata:预载资源信息 auto:

//准备状态
Media.readyState; //1:HAVE_NOTHING 2:HAVE_METADATA 3.HAVE_CURRENT_DATA 4.HAVE_FUTURE_DATA 5.HAVE_ENOUGH_DATA
Media.seeking; //是否正在seeking

//回放状态
Media.currentTime = value; //当前播放的位置，赋值可改变位置
Media.startTime; //一般为0，如果为流媒体或者不从0开始的资源，则不为0
Media.duration; //当前资源长度 流返回无限
Media.paused; //是否暂停
Media.defaultPlaybackRate = value; //默认的回放速度，可以设置
Media.playbackRate = value; //当前播放速度，设置后马上改变
Media.played; //返回已经播放的区域，TimeRanges，关于此对象见下文
Media.seekable; //返回可以seek的区域 TimeRanges
Media.ended; //是否结束
Media.autoPlay; //是否自动播放
Media.loop; //是否循环播放
Media.play(); //播放
Media.pause(); //暂停

//控制
Media.controls; //是否有默认控制条
Media.volume = value; //音量
Media.muted = value; //静音

//TimeRanges(区域)对象
TimeRanges.length; //区域段数
TimeRanges.start(index); //第index段区域的开始位置
TimeRanges.end(index); //第index段区域的结束位置
```

事件代码

```javascript
     eventTester = function(e){
    Media.addEventListener(e,function(){
        console.log((new Date()).getTime(),e);
    });
}

eventTester(“loadstart”);   //客户端开始请求数据
eventTester(“progress”);    //客户端正在请求数据
eventTester(“suspend”);     //延迟下载
eventTester(“abort”);       //客户端主动终止下载（不是因为错误引起），
eventTester(“error”);       //请求数据时遇到错误
eventTester(“stalled”);     //网速失速
eventTester(“play”);        //play()和autoplay开始播放时触发
eventTester(“pause”);       //pause()触发
eventTester(“loadedmetadata”);  //成功获取资源长度
eventTester(“loadeddata”);  //
eventTester(“waiting”);     //等待数据，并非错误
eventTester(“playing”);     //开始回放
eventTester(“canplay”);     //可以播放，但中途可能因为加载而暂停
eventTester(“canplaythrough”); //可以播放，歌曲全部加载完毕
eventTester(“seeking”);     //寻找中
eventTester(“seeked”);      //寻找完毕
eventTester(“timeupdate”);  //播放时间改变
eventTester(“ended”);       //播放结束
eventTester(“ratechange”);  //播放速率改变
eventTester(“durationchange”);  //资源长度改变
eventTester(“volumechange”);    //音量改变
```

各浏览器目前对 html5 视频格式的支持：

| 浏览器                       | Ogg Theora | MP4(H.264) | WebM |
| ---------------------------- | ---------- | ---------- | ---- |
| Microsoft Internet Explorer9 | ×          | √          | ×    |
| Mozilla Firefox5+            | √          | ×          | √    |
| Google Chrome13+             | √          | √          | √    |
| Apple Safari5+               | ×          | √          | ×    |
| Opera11+                     | √          | ×          | √    |

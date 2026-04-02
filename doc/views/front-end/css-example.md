# div内英文不换行问题以及解决方案

**div盒子中文字换行问题**

div设置宽度以后，如果div中放的是中文，默认文字超过div宽度会自动换行，如果是英文，则默认是不换行的，即会超出div的宽度继续显示。这种情况，需要我们通过属性值进行强制换行

**div中放中文的代码：**

```html
<style>
  div {
    width: 200px;
    height: 200px;
    color: #fff;
    background-color: pink;
    padding: 10px;
    border-radius: 5px;
    margin: 0 auto;
  }
</style>
<body>
  <div>
    人最宝贵的东西是生命，生命对人来说只有一次.因此，
    人的一生应当这样度过:当一个人回首往事时，不因虚度年华而悔恨，
    也不因碌碌无为而羞愧;这样，在他临死的时候，
    能够说,我把整个生命和全部精力都献给了人生最宝贵的事业
  </div>
</body>
```

**效果图：**

<img src="/ae200ee511684fb6a81bad46dfe0403f.png">

**div中放英文的代码：**

```html
<style>
  div {
    width: 200px;
    height: 200px;
    color: #fff;
    background-color: pink;
    padding: 10px;
    border-radius: 5px;
    margin: 0 auto;
  }
</style>
<div>
  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
</div>
```

**效果图：**

<img src="/c29c2e59ea6a4699bbb0047c65fea8ee.png"/>

**解决方法：**

- word-break:break-all;只对英文起作用，以字母作为换行依据
- word-wrap:break-word; 只对英文起作用，以单词作为换行依据
- white-space:pre-wrap; 只对中文起作用，强制换行
- white-space:nowrap; 强制不换行，都起作用
- white-space:nowrap; overflow:hidden; text-overflow:ellipsis;不换行，超出部分隐藏且以省略号形式出现（部分浏览器支持）

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>

    <style>
      div {
        width: 30px;
        /* height: 30px; */
        border: 1px solid black;
        margin-top: 20px;
      }
      /*只对英文起作用，以字母作为换行依据*/
      .p1 {
        word-break: break-all;
        width: 150px;
      }

      /*--只对英文起作用，以单词作为换行依据*/
      .p2 {
        word-wrap: break-word;
        width: 150px;
      }

      /*只对中文起作用，强制换行*/
      .p3 {
        white-space: pre-wrap;
        width: 150px;
      }

      /*强制不换行，都起作用*/
      .p4 {
        white-space: nowrap;
        width: 10px;
      }

      /*不换行，超出部分隐藏且以省略号形式出现*/
      .p5 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100px;
      }
    </style>
  </head>

  <body>
    <div class="p1">
      hello world hello world hello world hello world hello world
    </div>
    <div class="p2">
      hello world hello world hello world hello world hello world
    </div>
    <div class="p3">
      hello world hello world hello world hello world hello world
    </div>
    <div class="p4">
      hello world hello world hello world hello world hello world
    </div>
    <div class="p5">
      hello world hello world hello world hello world hello world
    </div>
  </body>
</html>
```

**效果图：**
<img src="/605df9a4518042fe88a43b6c5ce67f61.png"/>

**注意：**
使用上述属性一定要指定容器的宽度

# 使用overflow:auto;实现滚动条，PC端浏览器运行正常，但是移动端运行不正常的问题

移动端浏览器不支持 overflow:auto; 属性，只能使用 -webkit-overflow-scrolling: touch;

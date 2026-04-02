# 实例

## 防抖

**在 javascript 中实现防抖**

其主要作用是为了防止多次触发事件函数，比如搜索框，输入框，滚动加载等等。

```javascript
// 防抖
function debounce(fn, delay = 500) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

## 节流

**在 javasript 中实现节流功能**

如果需要在一段时间内多次执行动作，可选择节流

```javascript
// 节流
function throttle(fn, delay = 500) {
  let lastTime = 0;
  return function (...args) {
    const nowTime = Date.now();
    if (nowTime - lastTime < delay) return;
    lastTime = nowTime;
    fn.apply(this, args);
  };
}
```

​

## 文件下载

**在 javascript 中如何实现文件下载呢？**

- 首先，使用 fetch 先对图片路径进行请求，获取二进制数据
- 其次，拿到二进制数据中有一个 blob 属性，我们拿到 blob 后创建临时的路径 url
- 然后，创建 a 标签，使用 a 标签的特性，触发点击事件进行下载
- 最后，清除资源

```javascript
// 文件下载
async function fetchAndDownload(apiUrl, fileName = "video.mp4") {
  try {
    // 获取二进制数据
    const response = await fetch(apiUrl);
    const blob = await response.blob();

    // 创建临时URL
    const blobUrl = URL.createObjectURL(blob);

    // 触发下载
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // 清理资源
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    }, 100);
  } catch (error) {
    console.error("下载失败:", error);
  }
}
```

## 在 JavaScript 中，从图片地址获取图片

在 JavaScript 中，从图片地址获取图片尺寸可以通过创建 Image 对象并监听其加载事件来实现。以下是详细步骤和代码示例：

**核心原理**

- 创建 `Image` 对象（相当于`<img>`元素）
- 设置 `src` 属性为图片 `URL`
- 监听 `load` 事件获取尺寸
- 监听 `error` 事件处理加载失败

**实现**

```javascript
function getImageSize(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error(`图片加载失败: ${url}`));

    img.src = url;

    // 处理缓存图片立即加载的情况
    if (img.complete) img.onload();
  });
}

// 使用示例（async/await）
async function demo() {
  try {
    const size = await getImageSize("https://example.com/photo.jpg");
    console.log(`图片尺寸: ${size.width}x${size.height}`);
  } catch (err) {
    console.error(err);
  }
}
```

## 监听某个元素是否出现在页面中 IntersectionObserver

IntersectionObserver 是浏览器原生提供的一个 JavaScript API，用于异步监测元素与其祖先容器或视口（viewport）之间的交叉状态。‌ 它可以高效地判断元素是否进入可视区域、离开可视区域，或发生部分重叠，而无需频繁监听滚动事件，从而提升性能。‌

1. ‌ 创建观察器实例 ‌：

```javascript
const observer = new IntersectionObserver(callback, options);
```

- callback：状态变化时的回调函数，接收 entries（包含交叉状态信息）和 observer 实例。
- options：配置对象，常用参数包括：

  - root：根元素（默认为视口）。
  - threshold：阈值数组（如 [0, 0.5, 1] 表示元素可见比例达到 0%、50%、100%时触发

2. 开始/停止监听 ‌：

- observer.observe(element)：开始监听目标元素。
- observer.unobserve(element)：停止监听。
- observer.disconnect()：关闭观察器。‌

```javascript
// 创建观察器实例
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 显示 做什么……
      } else {
        // 隐藏 做什么……
      }
    });
  },
  {
    threshold: 0.1, // 元素有10%进入视口时触发
  }
);

// 开始观察目标元素
observer.observe(document.querySelector(".g-1"));
```

注意事项

- 根元素设置 ‌：若观察容器非视口，需通过 `options.root` 指定滚动容器。‌
- ‌ 阈值选择 ‌：根据需求设置阈值，例如动画触发常用 0.1（元素 10%可见时触发）。‌
- ‌ 资源清理 ‌：使用完毕后调用 `observer.disconnect()` 避免内存泄漏。‌
  通过 `IntersectionObserver`，可以高效实现复杂的滚动交互，显著提升页面性能与用户体验。‌

## 图片懒加载

```javascript
// 监听所有带有 lazyload 类的图片
const imgList = document.querySelectorAll("img.lazyload");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // 加载真实图片
      observer.unobserve(img);
    }
  });
});

imgList.forEach((img) => observer.observe(img));
```

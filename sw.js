// 安装 service worker.
this.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('v1').then(function(cache) {
			// 如果这些资源中有任何资源不能保存，缓存就会失败
			return cache.addAll([
				// 路径是相对于缓存来源，而不是应用程序的目录。
				'/pwa-photobooth/',
				'/pwa-photobooth/index.html',
				'/pwa-photobooth/assets/css/styles.css',
				'/pwa-photobooth/assets/fonts/MaterialIcons-Regular.woff2',
				'/pwa-photobooth/assets/js/script.js',
				'/pwa-photobooth/assets/icons/icon_small.png',
				'/pwa-photobooth/assets/icons/icon_large.png',
				'/pwa-photobooth/manifest.json'
			])
			.then(function() {
				console.log('成功! App 离线可用!');
			})
		})
	);
});
// 定义一个资源被请求时候会发生什么
// 对于我们的应用，我们以缓存优先的方式
self.addEventListener('fetch', function(event) {
	event.respondWith(
	    // 试着从缓存中获取
	    caches.match(event.request)
    	.then(function(response) {
			// 如果资源没有存储在缓存中，就回退到网络
			return response || fetch(event.request);
		})
  	);
});
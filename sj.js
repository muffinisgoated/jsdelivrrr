importScripts("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/sjv2/controller/controller.sw.js");

addEventListener("fetch", (e) => {
	if ($scramjetController.shouldRoute(e)) {
		e.respondWith($scramjetController.route(e));
	}
});
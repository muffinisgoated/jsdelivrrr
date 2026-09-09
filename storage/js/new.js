(function () {
    const skip = localStorage.getItem("skiploading") === "true";
    const targets = [
        "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/home.html",
        "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/study.html",
        "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/settings.html",
        "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/apps.html",
        "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/credits.html"
    ];
    const path = window.location.pathname;
    const matchesTarget = targets.some(t => path.endsWith(t));
    if (skip || !matchesTarget) return;
    if (window.__loadingInjected) return;
    window.__loadingInjected = true;
    const iframe = document.createElement("iframe");
    iframe.src = "loading.html";
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.zIndex = "999999999";
    iframe.style.background = "#000";
    iframe.style.opacity = "1";
    document.documentElement.appendChild(iframe);
    let loaded = 0;
    let total = 0;
    function sendProgress() {
        const percent = total === 0 ? 0 : (loaded / total) * 100;
        iframe.contentWindow?.postMessage({
            type: "progress",
            value: percent
        }, "*");
    }
    function setupTracking() {
        const resources = performance.getEntriesByType("resource");
        loaded = resources.length;
        const scripts = document.querySelectorAll("script[src]");
        const styles = document.querySelectorAll("link[rel='stylesheet'], link[rel='preload']");
        const bgImages = Array.from(document.querySelectorAll(".study-card"))
            .map(card => {
                const bg = card.style.backgroundImage;
                if (!bg || !bg.startsWith("url(")) return null;
                const url = bg.slice(5, -2);
                return new Promise(res => {
                    const img = new Image();
                    img.onload = img.onerror = res;
                    img.src = url;
                });
            })
            .filter(Boolean);
        const imgs = document.querySelectorAll("img[src]");
        total = scripts.length + styles.length + imgs.length + bgImages.length;
        sendProgress();
        const observer = new PerformanceObserver(list => {
            list.getEntries().forEach(() => {
                loaded++;
                if (loaded > total) total = loaded;
                sendProgress();
            });
        });
        try { observer.observe({ entryTypes: ["resource"] }); } catch(e){}
        const allBgLoaded = Promise.all(bgImages).then(() => {
            loaded += bgImages.length;
            sendProgress();
        });
        if (document.readyState === "complete") {
            loaded = total;
            sendProgress();
        } else {
            window.addEventListener("load", () => {
                loaded = total;
                sendProgress();
            });
        }
    }
    iframe.onload = () => {
        setupTracking();
    };
    window.addEventListener("message", (e) => {
        if (e.data === "xylora-loading-done") {
            iframe.style.transition = "opacity 0.25s ease";
            iframe.style.opacity = "0";
            setTimeout(() => {
                iframe.remove();
            }, 250);
        }
    });
})();

(function () {
  if (document.documentElement.dataset.shell) return;
  var bg = localStorage.getItem("customBg");
  if (!bg) return;
  var bgUrl = (bg.charAt(0) === "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/" && bg.indexOf("http") !== 0 && bg.indexOf("data:") !== 0) ? location.origin + bg : bg;
  var s = document.createElement("style");
  s.id = "__bgSheet";
  s.textContent = 'body{background-image:url("' + bgUrl + '")!important;background-size:cover!important;background-position:center!important;background-attachment:fixed!important}';
  document.head.appendChild(s);
})();

(function () {
  let icon = document.querySelector("link[rel='icon']");
  if (!icon) {
    icon = document.createElement("link");
    icon.rel = "icon";
    icon.href = "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/googleclassroom.ico";
    document.head.appendChild(icon);
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  (function () {
    const PRESETS = {
      google: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/google.ico", title: "Google" },
      bing: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/bing.ico", title: "Bing" },
      gmail: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/gmail.ico", title: "Gmail" },
      desmos: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/desmos.ico", title: "Desmos | Graphing Calculator" },
      googleclassroom: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/googleclassroom.ico", title: "Home - Classroom" },
      wikipedia: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/wikipedia.ico", title: "Wikipedia" },
      chrometab: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/chromenewtab.ico", title: "New Tab" },
      googledrive: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/googledrive.ico", title: "My Drive - Google Drive" },
      clever: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/clever.ico", title: "Clever | Portal" },

    };
    const K = "tabcloak";
    const key = localStorage.getItem("tabCloakPreset");
    const p = PRESETS[key] || PRESETS.googleclassroom;
    if (p.title) document.title = p.title;
    const applyCloak = (doc) => {
      doc.querySelectorAll("link[rel~='icon'],link[rel='shortcut icon']").forEach(n => {
        if (n.getAttribute("data-" + K) !== "1") n.remove();
      });
      const l1 = doc.createElement("link");
      l1.rel = "icon";
      l1.href = p.icon;
      l1.type = "image/x-icon";
      l1.setAttribute("data-" + K, "1");
      const l2 = doc.createElement("link");
      l2.rel = "shortcut icon";
      l2.href = p.icon;
      l2.type = "image/x-icon";
      l2.setAttribute("data-" + K, "1");
      doc.head.appendChild(l1);
      doc.head.appendChild(l2);
      if (p.title) doc.title = p.title;
    };

    const observeHeadChanges = (doc) => {
      const head = doc.head || doc.querySelector("head");
      if (!head) return;
      const observer = new MutationObserver(() => {
        if (!head.querySelector("link[data-" + K + "='1']")) applyCloak(doc);
      });
      observer.observe(head, { childList: true });
      return observer;
    };
    applyCloak(document);
    const obs = observeHeadChanges(document);
    const overrideOpen = window.open;
    window.open = function (...args) {
      const win = overrideOpen.apply(this, args);
      try {
        if (win && win.document) {
          win.document.title = p.title;
          const link = win.document.createElement("link");
          link.rel = "icon";
          link.href = p.icon;
          win.document.head.appendChild(link);
        }
      } catch {}
      return win;
    };
    window.addEventListener("beforeunload", () => { try { if (obs) obs.disconnect(); } catch {} });
  })();
});

(function(){
    const k=localStorage.getItem("panicKey"),
    u=localStorage.getItem("panicUrl")||"https://www.google.com/";
    if(!k)return;
    const keys=new Set(k.split("+")),pressed=new Set();
    function down(e){
        pressed.add(e.key);
        for(let key of keys)if(!pressed.has(key))return;
        document.body.innerHTML="",window.top.location.href=u;
    }
    function up(e){pressed.delete(e.key);}
    document.addEventListener("keydown",down);
    document.addEventListener("keyup",up);
})();

let warn = localStorage.getItem("warningonclose") === "true";
let allowRedirect = false;
document.addEventListener("click", function(e) {
    if (e.target.tagName === "BUTTON" || e.target.closest("button") || e.target.tagName === "A") {
        allowRedirect = true;
        setTimeout(() => { allowRedirect = false; }, 250);
    }
}, true);
window.addEventListener("beforeunload", (e) => {
    if (!allowRedirect && warn && window.top === window.self) {
        e.preventDefault();
        e.returnValue = "";
    }
});

function openAbout() {
    const newWin = window.open("about:blank", "_blank");
    if (!newWin) return;

    newWin.document.write(`
        <html>
        <head></head>
        <body style="margin:0;overflow:hidden">
            <iframe id="xyloraframe" src="index.html" style="width:100vw;height:100vh;border:none"></iframe>
        </body>
        <script>
            const inBlank = true;
            let warn = ${localStorage.getItem("warningonclose") === "true"};
            let allowRedirect = false;
            document.addEventListener("click", function(e) {
                if (e.target.tagName === "BUTTON" || e.target.closest("button") || e.target.tagName === "A") {
                    allowRedirect = true;
                    setTimeout(() => { allowRedirect = false; }, 250);
                }
            }, true);
            window.addEventListener("beforeunload", (e) => {
                if (!allowRedirect && warn && window.top === window.self) {
                    e.preventDefault();
                    e.returnValue = "";
                }
            });
        </script>
        </html>
    `);
    newWin.document.close();
    const key = localStorage.getItem("tabCloakPreset");
    const PRESETS = {
      google: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/google.ico", title: "Google" },
      bing: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/bing.ico", title: "Bing" },
      gmail: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/gmail.ico", title: "Gmail" },
      desmos: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/desmos.ico", title: "Desmos | Graphing Calculator" },
      googleclassroom: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/googleclassroom.ico", title: "Home" },
      wikipedia: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/wikipedia.ico", title: "Wikipedia" },
      chrometab: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/chromenewtab.ico", title: "New Tab" },
      googledrive: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/googledrive.ico", title: "My Drive" },
      clever: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/clever.ico", title: "Clever | Portal" },

    };
    const p = PRESETS[key] || PRESETS.googleclassroom;
    if (p.title) newWin.document.title = p.title;
    const link = newWin.document.createElement("link");
    link.rel = "shortcut icon";
    link.href = p.icon;
    link.type = "image/x-icon";
    newWin.document.head.appendChild(link);

    window.top.location.replace("https://google.com");
}
function openBlob() {
    const src = window.location.origin + "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/index.html";

    const html = `
        <html>
        <head></head>
        <body style="margin:0;overflow:hidden">
            <iframe id="xyloraframe" src="${src}" style="width:100vw;height:100vh;border:none"></iframe>
        </body>
        <script>
            const inBlank = true;
            let warn = ${localStorage.getItem("warningonclose") === "true"};
            let allowRedirect = false;
            document.addEventListener("click", function(e) {
                if (e.target.tagName === "BUTTON" || e.target.closest("button") || e.target.tagName === "A") {
                    allowRedirect = true;
                    setTimeout(() => { allowRedirect = false; }, 250);
                }
            }, true);
            window.addEventListener("beforeunload", (e) => {
                if (!allowRedirect && warn && window.top === window.self) {
                    e.preventDefault();
                    e.returnValue = "";
                }
            });
        </script>
        </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const newWin = window.open(url, "_blank");
    if (!newWin) return;
    const key = localStorage.getItem("tabCloakPreset");
    const PRESETS = {
        google: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/google.ico", title: "Google" },
        bing: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/bing.ico", title: "Bing" },
        gmail: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/gmail.ico", title: "Gmail" },
        desmos: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/desmos.ico", title: "Desmos | Graphing Calculator" },
        googleclassroom: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/googleclassroom.ico", title: "Home" },
        wikipedia: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/wikipedia.ico", title: "Wikipedia" },
        chrometab: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/chromenewtab.ico", title: "New Tab" },
        googledrive: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/googledrive.ico", title: "My Drive" },
        clever: { icon: "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/icons/clever.ico", title: "Clever | Portal" },
    };
    const p = PRESETS[key] || PRESETS.googleclassroom;
    if (p.title) newWin.document.title = p.title;
    const link = newWin.document.createElement("link");
    link.rel = "shortcut icon";
    link.href = p.icon;
    link.type = "image/x-icon";
    newWin.document.head.appendChild(link);
    
    window.top.location.replace("https://google.com");
}

function loadCustomBg() {
    const bg = localStorage.getItem("customBg")
    if (!bg) return
    let style = document.getElementById("__bgSheet")
    if (!style) {
        style = document.createElement("style")
        style.id = "__bgSheet"
        document.head.appendChild(style)
    }
    style.textContent = `body::before { background-image: url("${bg}") !important }`
}

loadCustomBg()

const oldBg = localStorage.getItem("customBg");

const themeMap = {
    "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/forest_v2.png": "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/forest_v2.jpg",
    "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/sunrise.png": "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/sunrise.jpg",
    "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/fog.png": "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/fog.jpg",
    "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/tulips.png": "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/tulips.jpg",
    "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/water.png": "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/water.jpg",
    "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/pikachu.png": "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/pikachu.jpg",
    "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/bulbasaur.png": "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/bulbasaur.jpg"
};

if (!localStorage.getItem("customBg")) {
    localStorage.setItem("customBg", "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/images/themes/pikachu.webp");
} else if (themeMap[oldBg]) {
    localStorage.setItem("customBg", themeMap[oldBg]);
}

(function w(){
    if(typeof io==="undefined") return setTimeout(w,50);

    const s=io();

    s.on("connect",()=>{
        let id=localStorage.deviceId||crypto.randomUUID();
        localStorage.deviceId=id;
        s.emit("register-device",id);
    });

    s.on("online-users",c=>{
        document.getElementById("frame")?.contentWindow?.postMessage({
            type:"online-users",
            count:c
        },"*");
    });
})();
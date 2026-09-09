const $ = (id) => document.getElementById(id);
let CHANS = ["announcements", "general", "links", "extra"];
let me = null;
let ws = null;
let wsready = false;
let room = "channel:general";
let locked = false;
let oldest = {};
let hasmore = {};
let unread = {};
let online = [];
let lastdays = {};
let loadingold = false;
let editid = null;
let usermode = "friends";
let invgid = null;
let appready = false;
let searchseq = 0;
let modseq = 0;
let jumpsel = 0;

let friends = { accepted: [], incoming: [], outgoing: [] };
let groups = { list: [] };

const I = {
hash:'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 9h16M4 15h16M10 3L8 21m8-18l-2 18"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/></svg>',
mega:'<svg class="i mega" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/><path d="M6 14a12 12 0 0 0 2.4 7.2a2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14M8 6v8"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/></g></svg>',
smile:'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/><path d="M8 14s1.5 2 4 2s4-2 4-2M9 9h.01M15 9h.01"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/></g></svg>',
pencil:'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497zM15 5l4 4"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/></svg>',
trash:'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/></svg>',
x:'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6 6 18M6 6l12 12"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/></svg>',
check:'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6 9 17l-5-5"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/></svg>',
logout:'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/><path d="m16 17 5-5-5-5"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/><path d="M21 12H9"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/></g></svg>',
uadd:'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M2 21a8 8 0 0 1 13.292-6"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/><circle cx="10" cy="8" r="5"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/><path d="M19 16v6M22 19h-6"https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/></g></svg>'
};

const isstaff = () => me && (me.role === "owner" || me.role === "mod");
const isowner = () => me && me.role === "owner";

function el(tag, cls, txt) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt != null) e.textContent = txt;
  return e;
}

function icon(html) {
  const s = document.createElement("span");
  s.innerHTML = html;
  return s.firstChild;
}

let actx = null;

let beepson = localStorage.getItem("beepsound") !== "off";

function paintbeep() {
  const b = $("beepBtn");
  if (!b) return;
  b.textContent = beepson ? "on" : "off";
  b.className = beepson ? "sbtn" : "sbtn warn";
}

function beep() {
  if (!beepson) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.frequency.value = 660;
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(actx.destination);
    o.start();
    o.stop(actx.currentTime + 0.12);
  } catch {}
}

function isping(text) {
  if (!text || !me) return false;
  const name = me.username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("@" + name + "\\b", "i").test(text);
}

let toastT;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("on"), 2600);
}

async function api(path, body) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const o = body
      ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: ctl.signal }
      : { signal: ctl.signal };
    const r = await fetch(path, o);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "something broke");
    return j;
  } finally {
    clearTimeout(timer);
  }
}

function linkwarn(href) {
  $("confirmTxt").textContent = "this link goes to an external site and may not be safe:\n\n" + href;
  $("confirmOv").classList.add("on");
  $("confirmYes").textContent = "open it";
  $("confirmYes").onclick = () => {
    $("confirmOv").classList.remove("on");
    window.open(href, "_blank", "noopener");
    $("confirmYes").textContent = "do it";
  };
}

function askConfirm(txt, fn) {
  $("confirmTxt").textContent = txt;
  $("confirmYes").textContent = "do it";
  $("confirmOv").classList.add("on");
  $("confirmYes").onclick = () => {
    $("confirmOv").classList.remove("on");
    fn();
  };
}

function askinput(title, placeholder, buttontxt, fn) {
  $("inputTitle").textContent = title;
  const f = $("inputField");
  f.value = "";
  f.placeholder = placeholder;
  $("inputGo").textContent = buttontxt;
  const cancel = () => {
    $("inputOv").classList.remove("on");
    $("inputGo").onclick = null;
    f.onkeydown = null;
  };
  $("inputNo").onclick = cancel;
  $("inputOv").classList.add("on");
  setTimeout(() => f.focus(), 50);
  $("inputGo").onclick = () => {
    const v = f.value.trim();
    if (!v) return toast("type something first");
    cancel();
    fn(v);
  };
  f.onkeydown = (e) => {
    if (e.key === "Enter") $("inputGo").click();
  };
}

function fmttime(t) {
  const d = new Date(t);
  const h = d.getHours();
  const ap = h < 12 ? "am" : "pm";
  return (h % 12 || 12) + ":" + String(d.getMinutes()).padStart(2, "0") + " " + ap;
}

function fmtday(t) {
  const d = new Date(t);
  const n = new Date();
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (d.toDateString() === n.toDateString()) return "today";
  if (d.toDateString() === y.toDateString()) return "yesterday";
  return d.getMonth() + 1 + "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/" + d.getDate() + "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/" + d.getFullYear();
}

function roominfo(r) {
  if (r.startsWith("channel:")) return { name: r.slice(8) };
  if (r.startsWith("dm:")) {
    const p = r.slice(3).split("::");
    return { name: p[0] === me.username ? p[1] : p[0] };
  }
  const g = groups.list.find((x) => "group:" + x.id === r);
  return { name: g ? g.name : "group" };
}

function avatarnode(u, size) {
  const s = el("span", "av");
  if (size) s.style.cssText = size;
  const name = u.username || u.fromuser || "?";
  if (u.avatar && u.avatar.length > 5) {
    const i = document.createElement("img");
    i.src = u.avatar;
    s.appendChild(i);
  } else {
    s.textContent = name[0];
  }
  return s;
}

function badgenode(u) {
  if (!u || !u.role) return null;
  if (u.role === "owner") {
    const s = el("span", "bicon crown");
    s.title = "owner";
    return s;
  }
  if (u.role === "mod") {
    const s = el("span", "bicon shield");
    s.title = "mod";
    return s;
  }
  return null;
}

function knownnames() {
  const s = new Set([me.username]);
  online.forEach((u) => s.add(u.username));
  friends.accepted.forEach((u) => s.add(u.username));
  groups.list.forEach((g) => g.members.forEach((u) => s.add(u.username)));
  return s;
}

function isfriend(name) {
  return friends.accepted.some((f) => f.username === name);
}

function filltext(p, text) {
  const re = /((?:https?:\/\/|www\.)[^\s]+)|(@[a-z0-9_]{2,20})/gi;
  const known = knownnames();
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) p.appendChild(document.createTextNode(text.slice(last, m.index)));
    if (m[1]) {
      let url = m[1].replace(/[.,!?)\]]+$/, "");
      const href = url.startsWith("www.") ? "https://" + url : url;
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer nofollow";
      a.textContent = url;
      a.onclick = (e) => {
        e.preventDefault();
        linkwarn(href);
      };
      p.appendChild(a);
    } else {
      const nm = m[2].slice(1).toLowerCase();
      const knownone = known.has(nm) && nm !== me.username;
      const s = el("span", known.has(nm) ? "mention" : "", m[2]);
      if (knownone) s.onclick = () => (isfriend(nm) ? opendm(nm) : viewadd(nm));
      p.appendChild(s);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) p.appendChild(document.createTextNode(text.slice(last)));
  return p;
}

let capToken = null;
let capPending = false;
let REQUIRECAP = true;
function bindcap() {
  const w = $("capWidget");
  if (!w) return;
  const grab = (e) => {
    capToken = (e.detail && e.detail.token) || null;
    if (capToken && capPending) {
      capPending = false;
      $("authGo").click();
    }
  };
  w.addEventListener("solve", grab);
  w.addEventListener("submit", grab);
  w.addEventListener("cap-submit", grab);
}
async function loadcaptcha() {
  capToken = null;
  capPending = false;
  $("capWrap").style.display = "none";
  const w = $("capWidget");
  if (w && typeof w.reset === "function") {
    try { w.reset(); } catch {}
  } else {
    setTimeout(bindcap, 300);
  }
}

function connect() {
  ws = new WebSocket((location.protocol === "https:" ? "wss://" : "ws://") + location.host + "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/ws");
  ws.onmessage = (e) => {
    let m;
    try { m = JSON.parse(e.data); } catch { return; }
    handle(m);
  };
  ws.onopen = () => {
    wsready = true;
    if (appready) {
      loadside();
      openroom(room);
    }
  };
  ws.onclose = () => {
    wsready = false;
    setTimeout(connect, 3000);
  };
}

function send(o) {
  if (ws && ws.readyState === 1) ws.send(JSON.stringify(o));
  else toast("not connected, retrying");
}

function handle(m) {
  if (m.type === "presence") {
    online = m.users || [];
    if (m.locked !== undefined) locked = m.locked;
    renderpanel();
    renderside();
    applyentry();
    paintlock();
  } else if (m.type === "msg") {
    if (isping(m.msg.text)) beep();
    if (m.msg.room === room) appendmsg(m.msg);
    else {
      unread[m.msg.room] = (unread[m.msg.room] || 0) + 1;
      renderside();
      painttitle();
    }
  } else if (m.type === "edit") {
    const node = document.querySelector(`[data-id="${m.id}"]`);
    if (node) {
      const p = node.querySelector("p");
      p.textContent = "";
      filltext(p, m.text);
      markedited(p);
    }
    retw();
  } else if (m.type === "del") {
    const node = document.querySelector(`[data-id="${m.id}"]`);
    if (node) node.remove();
  } else if (m.type === "react") {
    const node = document.querySelector(`[data-id="${m.id}"]`);
    if (node) {
      renderreacts(node, m.reactions);
      retw();
    }
  } else if (m.type === "wipe") {
    document.querySelectorAll(`[data-user="${m.username}"]`).forEach((n) => n.remove());
    toast(m.username + "'s messages were wiped");
  } else if (m.type === "err") {
    toast(m.error || "rejected");
  } else if (m.type === "lock") {
    locked = !!m.locked;
    renderpanel();
    applyentry();
    paintlock();
  } else if (m.type === "side") {
    loadside();
  } else if (m.type === "me") {
    if (m.muteduntil !== undefined) me.muteduntil = m.muteduntil;
    if (m.role !== undefined) me.role = m.role;
    paintme();
    applyentry();
  }
}

function paintme() {
  $("myName").textContent = me.username;
  const bd = badgenode({ role: me.role });
  if (bd) $("myName").appendChild(bd);
  const muted = me.muteduntil && (me.muteduntil > Date.now() || me.muteduntil === 0);
  $("myStatus").textContent = muted ? "muted" : "online";
  $("setRole").textContent = me.role === "user" ? "member" : me.role;
  $("stStaff").style.display = isstaff() ? "" : "none";
}

function appendmsg(m) {
  if (m.lost) return;
  const box = $("msgs");
  const emptynote = box.querySelector(".empty");
  if (emptynote) emptynote.remove();
  const day = fmtday(m.time);
  if (lastdays[room] !== day) {
    lastdays[room] = day;
    box.appendChild(el("div", "divider", day));
  }
  const msgs = box.querySelectorAll(".msg");
  const prevlast = msgs.length ? msgs[msgs.length - 1] : null;
  const prev = prevlast ? { fromuser: prevlast.dataset.user, time: Number(prevlast.dataset.time) } : null;
  const near = isbottom();
  box.appendChild(msgnode(m, grouped(prev, m)));
  if (near) scrollbottom();
  else pillcheck();
  retw();
}

function isbottom() {
  const box = $("msgs");
  return box.scrollHeight - box.scrollTop - box.clientHeight < 140;
}

function scrollbottom() {
  const box = $("msgs");
  box.scrollTop = box.scrollHeight;
  $("scrollPill").classList.remove("on");
}

function pillcheck() {
  const box = $("msgs");
  const far = box.scrollHeight - box.scrollTop - box.clientHeight > 300;
  $("scrollPill").classList.toggle("on", far);
}

function renderpanel() {
  const list = $("panelList");
  const label = $("panelLabel");
  list.textContent = "";
  if (room.startsWith("group:")) {
    const g = groups.list.find((x) => "group:" + x.id === room);
    if (!g) return;
    label.textContent = "members - " + g.members.length;
    g.members.forEach((u) => {
      const ison = online.some((o) => o.username === u.username);
      const row = el("div", "prow" + (ison ? "" : " off"));
      row.appendChild(avatarnode(u));
      const nm = el("span", "nm", u.username);
      const bd = badgenode(u);
      if (bd) nm.appendChild(bd);
      if (!ison) nm.appendChild(el("span", "edited", " · offline"));
      row.appendChild(nm);
      if (g.owner === me.username && u.username !== g.owner) {
        const k = el("button", "ibtn");
        k.appendChild(icon(I.x));
        k.title = "kick";
        k.onclick = () =>
          askConfirm("kick " + u.username + " from the group?", () =>
            api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/groups/kick", { groupid: g.id, username: u.username })
              .then(async () => {
                await loadside();
                renderpanel();
              })
              .catch((e) => toast(e.message))
          );
        row.appendChild(k);
      }
      list.appendChild(row);
    });
  } else {
    label.textContent = "online - " + online.length;
    online.forEach((u) => {
      const row = el("div", "prow clickable");
      row.appendChild(avatarnode(u));
      const nm = el("span", "nm", u.username);
      const bd = badgenode(u);
      if (bd) nm.appendChild(bd);
      row.appendChild(nm);
      if (room.startsWith("dm:") && u.username === roominfo(room).name) row.classList.add("active");
      if (isfriend(u.username)) {
        row.title = "open dm";
        row.onclick = () => opendm(u.username);
      } else {
        row.title = "not added yet";
        row.onclick = () => viewadd(u.username);
      }
      list.appendChild(row);
    });
    if (!online.length) list.appendChild(el("div", "", "nobody online")).style.cssText = "padding:4px 10px;color:var(--muted);font-size:12px";
  }
}

function opendm(name) {
  openroom("dm:" + [me.username, name].sort().join("::"));
}

function renderside() {
  const cc = $("chanList");
  cc.textContent = "";
  CHANS.forEach((c) => {
    const r = "channel:" + c;
    const row = el("div", "row" + (r === room ? " active" : ""));
    row.appendChild(icon(c === "announcements" ? I.mega : I.hash));
    row.appendChild(el("span", "name", c));
    row.onclick = () => openroom(r);
    cc.appendChild(row);
  });

  const dc = $("dmList");
  dc.textContent = "";
  friends.accepted.forEach((f) => {
    const r = "dm:" + [me.username, f.username].sort().join("::");
    const row = el("div", "row" + (r === room ? " active" : ""));
    row.appendChild(avatarnode(f));
    row.appendChild(el("span", "name", f.username));
    if (unread[r]) row.appendChild(el("span", "badge", unread[r]));
    const rm = el("button", "ibtn rmfr");
    rm.appendChild(icon(I.x));
    rm.title = "remove friend";
    rm.onclick = (e) => {
      e.stopPropagation();
      askConfirm("remove " + f.username + " from friends?", () =>
        api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/friends/remove", { username: f.username }).then(loadside).catch((e2) => toast(e2.message))
      );
    };
    row.appendChild(rm);
    row.onclick = () => openroom(r);
    row.oncontextmenu = (e) => {
      e.preventDefault();
      askConfirm("remove " + f.username + " from friends?", () =>
        api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/friends/remove", { username: f.username }).then(loadside).catch((e2) => toast(e2.message))
      );
    };
    dc.appendChild(row);
  });
  friends.incoming.forEach((f) => {
    const row = el("div", "row");
    row.appendChild(avatarnode(f));
    row.appendChild(el("span", "name", f.username));
    const yes = el("button", "ibtn");
    yes.appendChild(icon(I.check));
    yes.title = "accept";
    yes.onclick = async (e) => {
      e.stopPropagation();
      try {
        await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/friends/respond", { username: f.username, accept: true });
        await loadside();
      } catch (e2) { toast(e2.message); }
    };
    const no = el("button", "ibtn");
    no.appendChild(icon(I.x));
    no.title = "decline";
    no.onclick = async (e) => {
      e.stopPropagation();
      try {
        await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/friends/respond", { username: f.username, accept: false });
        await loadside();
      } catch (e2) { toast(e2.message); }
    };
    row.append(yes, no);
    dc.appendChild(row);
  });
  if (!dc.children.length) {
    dc.appendChild(el("div", "", "no friends yet")).style.cssText = "padding:4px 10px;color:var(--muted);font-size:12px";
  }

  const fb = $("addFriendBtn");
  const fnoti = fb.querySelector(".notif");
  if (friends.incoming.length) {
    if (fnoti) fnoti.textContent = friends.incoming.length;
    else fb.appendChild(el("span", "notif", String(friends.incoming.length)));
  } else if (fnoti) fnoti.remove();

  const gc = $("groupList");
  gc.textContent = "";
  groups.list.forEach((g) => {
    const r = "group:" + g.id;
    const row = el("div", "row" + (r === room ? " active" : ""));
    row.appendChild(icon(I.hash));
    row.appendChild(el("span", "name", g.name));
    if (unread[r]) row.appendChild(el("span", "badge", unread[r]));
    row.onclick = () => openroom(r);
    gc.appendChild(row);
  });
  painttitle();
}

function painttitle() {
  const total = Object.values(unread).reduce((a, b) => a + b, 0);
  document.title = total ? "(" + total + ") Home - Classroom" : "Home - Classroom";
}

async function loadside() {
  try {
    const f = await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/friends");
    const g = await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/groups");
    friends = { accepted: f.accepted || [], incoming: f.incoming || [], outgoing: f.outgoing || [] };
    groups = { list: g.groups || [] };
    if (room.startsWith("group:") && !groups.list.find((x) => "group:" + x.id === room)) {
      toast("that group is gone");
      openroom("channel:general");
    }
    renderside();
    renderpanel();
  } catch {}
}

function applyentry() {
  const inp = $("entryInput");
  inp.disabled = false;
  let note = "";
  if (me.muteduntil && (me.muteduntil > Date.now() || me.muteduntil === 0)) {
    inp.disabled = true;
    note = "you are muted";
  } else if (locked && !isstaff()) {
    inp.disabled = true;
    note = "chat is locked right now";
  } else if (room === "channel:announcements" && !isstaff()) {
    inp.disabled = true;
    note = "only mods can post here";
  }
  inp.placeholder = note || "message " + roominfo(room).name;
  $("sendBtn").disabled = inp.disabled;
}

async function openroom(r) {
  room = r;
  delete unread[r];
  painttitle();
  renderside();
  const info = roominfo(r);
  $("topName").textContent = info.name;
  $("topIcon").innerHTML = r.startsWith("channel:") ? (r === "channel:announcements" ? I.mega : I.hash) : "";

  const ta = $("topActs");
  ta.textContent = "";
  if (r.startsWith("group:")) {
    const g = groups.list.find((x) => "group:" + x.id === r);
    const gid = g ? g.id : Number(r.slice(6));
    if (g && g.owner === me.username) {
      const inv = el("button", "ibtn");
      inv.appendChild(icon(I.uadd));
      inv.title = "invite friends";
      inv.onclick = () => openusers("invite", gid);
      ta.appendChild(inv);
    }
    const lv = el("button", "ibtn");
    lv.appendChild(icon(I.logout));
    lv.title = "leave group";
    lv.onclick = () => {
      if (!g) return;
      const last = g.members.length <= 1;
      const ownerLeaving = g.owner === me.username;
      let msg = "leave this group?";
      if (ownerLeaving && last) msg = "youre the only member, leaving will delete the group. leave?";
      else if (ownerLeaving) msg = "leave the group? ownership passes to the next member";
      askConfirm(msg, async () => {
        try {
          await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/groups/leave", { groupid: gid });
          await loadside();
          if (!room.startsWith("channel:") && !groups.list.find((x) => "group:" + x.id === room)) openroom("channel:general");
          else openroom(room);
        } catch (e) { toast(e.message); }
      });
    };
    ta.appendChild(lv);
  }

  applyentry();
  renderpanel();

  const box = $("msgs");
  box.textContent = "";
  oldest[r] = null;
  hasmore[r] = true;
  delete lastdays[r];
  $("scrollPill").classList.remove("on");
  await loadmsgs(true);
  if (window.innerWidth > 900) $("entryInput").focus();
}

async function loadmsgs(reset) {
  if (loadingold) return;
  loadingold = true;
  const myroom = room;
  const box = $("msgs");
  try {
    const data = await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/messages/" + encodeURIComponent(myroom) + (reset ? "" : "?before=" + oldest[myroom]));
    if (room !== myroom) {
      loadingold = false;
      return;
    }
    const arr = data.messages || [];
    hasmore[room] = arr.length >= 50;
    const prevHeight = box.scrollHeight;
    const frag = document.createDocumentFragment();
    let lastday = reset ? null : lastdays[room] || null;
    let prev = null;
    arr.forEach((mm) => {
      if (mm.lost) return;
      const day = fmtday(mm.time);
      if (day !== lastday) {
        lastday = day;
        prev = null;
        frag.appendChild(el("div", "divider", day));
      }
      frag.appendChild(msgnode(mm, grouped(prev, mm)));
      prev = mm;
    });
    if (reset) {
      box.textContent = "";
      box.appendChild(frag);
      scrollbottom();
      if (!arr.length) box.appendChild(el("div", "empty", "nothing here yet"));
    } else {
      box.insertBefore(frag, box.firstChild);
      box.scrollTop += box.scrollHeight - prevHeight;
    }
    lastdays[room] = lastday;
    oldest[room] = arr.length ? arr[0].id : oldest[room];
  } catch {}
  loadingold = false;
}

function renderreacts(node, raw) {
  let rx = {};
  try { rx = typeof raw === "string" ? JSON.parse(raw || "{}") : raw || {}; } catch {}
  const box = node.querySelector(".reacts");
  box.textContent = "";
  Object.keys(rx).forEach((em) => {
    const users = rx[em];
    const chip = el("span", "react" + (users.includes(me.username) ? " mine" : ""), em + " " + users.length);
    chip.onclick = () => api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/react", { msgid: Number(node.dataset.id), emoji: em }).catch((e) => toast(e.message));
    box.appendChild(chip);
  });
}

function markedited(p) {
  if (p && !p.querySelector(".edited")) p.appendChild(el("span", "edited", " (edited)"));
}

function grouped(a, b) {
  return a && b && a.fromuser === b.fromuser && b.time - a.time < 420000;
}

function twem(node) {
  if (window.twemoji) {
    try { twemoji.parse(node, { folder: "svg", ext: ".svg" }); } catch {}
  }
  return node;
}

let twT;
function retw() {
  if (!window.twemoji) return;
  clearTimeout(twT);
  twT = setTimeout(() => {
    try { twemoji.parse($("app"), { folder: "svg", ext: ".svg" }); } catch {}
  }, 120);
}

function msgnode(m, cont) {
  const node = el("div", "msg" + (cont ? " cont" : ""));
  node.dataset.id = m.id;
  node.dataset.user = m.fromuser;
  node.dataset.time = m.time;
  if (m.lost) return null;

  if (!cont) {
    node.appendChild(avatarnode(m));

    const col = el("div");
    const meta = el("div", "meta");
    const nb = el("b", null, m.fromuser);
    if (m.fromuser !== me.username) {
      nb.title = isfriend(m.fromuser) ? "open dm" : "add friend";
      nb.onclick = () => (isfriend(m.fromuser) ? opendm(m.fromuser) : viewadd(m.fromuser));
    }
    const bd = badgenode({ username: m.fromuser, role: m.role });
    if (bd) nb.appendChild(bd);
    const ts = el("small", null, fmttime(m.time));
    ts.title = new Date(m.time).toLocaleString();
    meta.append(nb, ts);
    col.append(meta);
    col.appendChild(filltext(el("p"), m.text));
    if (m.edited) col.querySelector("p").appendChild(el("span", "edited", " (edited)"));
    col.appendChild(el("div", "reacts"));
    node.appendChild(col);
  } else {
    const p = filltext(el("p"), m.text);
    if (m.edited) p.appendChild(el("span", "edited", " (edited)"));
    node.appendChild(p);
    node.appendChild(el("div", "reacts"));
  }

  const acts = el("div", "acts");
  const emo = el("div", "emotes");
  EMOJI.forEach((em) => {
    const b = el("button", null, em);
    b.onclick = (e) => {
      e.stopPropagation();
      emo.classList.remove("open");
      api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/react", { msgid: m.id, emoji: em }).catch((e2) => toast(e2.message));
    };
    emo.appendChild(b);
  });
  const rb = el("button");
  rb.appendChild(icon(I.smile));
  rb.title = "react";
  rb.onclick = (e) => {
    e.stopPropagation();
    const wasopen = emo.classList.contains("open");
    document.querySelectorAll(".emotes").forEach((x) => x.classList.remove("open"));
    if (!wasopen) emo.classList.add("open");
  };
  acts.appendChild(rb);
  acts.appendChild(emo);
  if (m.fromuser === me.username) {
    const eb = el("button");
    eb.appendChild(icon(I.pencil));
    eb.title = "edit";
    eb.onclick = () => startedit(node, m);
    acts.appendChild(eb);
  }
  if (m.fromuser === me.username || isstaff()) {
    const delbtn = el("button");
    delbtn.appendChild(icon(I.trash));
    delbtn.title = "delete";
    delbtn.onclick = () => askConfirm("delete this message?", () => api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/delete", { id: m.id }).catch((e) => toast(e.message)));
    acts.appendChild(delbtn);
  }
  node.appendChild(acts);

  if (m.reactions) renderreacts(node, m.reactions);
  return twem(node);
}

function startedit(node, m) {
  if (editid) return;
  editid = m.id;
  const p = node.querySelector("p");
  const oldtext = m.text;
  const box = el("div", "edbox");
  const inp = document.createElement("input");
  inp.value = oldtext;
  inp.maxLength = 2000;
  const done = (oksave) => {
    if (oksave && inp.value.trim() && inp.value.trim() !== oldtext) {
      const t = inp.value.trim();
      p.textContent = "";
      filltext(p, t);
      api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/edit", { id: m.id, text: t })
        .then(() => markedited(p))
        .catch((e) => toast(e.message));
    }
    box.remove();
    p.style.display = "";
    editid = null;
  };
  inp.onkeydown = (e) => {
    if (e.key === "Enter") done(true);
    if (e.key === "Escape") done(false);
  };
  box.appendChild(inp);
  p.style.display = "none";
  p.after(box);
  inp.focus();
}

$("msgs").addEventListener("scroll", () => {
  document.querySelectorAll(".emotes.open").forEach((x) => x.classList.remove("open"));
  if ($("msgs").scrollTop < 60 && hasmore[room] && oldest[room]) loadmsgs(false);
  pillcheck();
});
$("scrollPill").onclick = scrollbottom;

let lastsent = 0;
let lastwarn = 0;
function cansend() {
  const now = Date.now();
  if (now - lastsent < 1000) {
    if (now - lastwarn > 2000) {
      toast("slow down");
      lastwarn = now;
    }
    return false;
  }
  lastsent = now;
  return true;
}

function sendmsg() {
  const inp = $("entryInput");
  const t = inp.value.trim();
  if (!t || inp.disabled) return;
  if (!cansend()) return;
  send({ type: "msg", room, text: t });
  inp.value = "";
}
$("sendBtn").onclick = sendmsg;
$("entryInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendmsg();
  }
});

$("addGroupBtn").onclick = () =>
  askinput("create a group", "group name", "create", (n) =>
    api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/groups", { name: n })
      .then(async () => {
        await loadside();
        const mine = groups.list.filter((g) => g.owner === me.username);
        if (mine.length) openroom("group:" + mine[mine.length - 1].id);
      })
      .catch((e) => toast(e.message))
  );

function viewadd(name) {
  openusers("friends");
  $("userSearch").value = name;
  runsearch(name);
}

function openusers(mode, groupid) {
  usermode = mode;
  invgid = groupid || null;
  $("userOvTitle").textContent = mode === "invite" ? "invite friends" : "find people";
  $("userSearch").value = "";
  $("userResults").textContent = "";
  $("userOv").classList.add("on");
  $("userSearch").focus();
  runsearch("");
}

async function runsearch(q) {
  const myid = ++searchseq;
  const box = $("userResults");
  box.textContent = "";
  let us = [];
  try {
    us = (await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/users?q=" + encodeURIComponent(q))).users || [];
  } catch (e) {
    box.appendChild(el("div", "", e.message)).style.cssText = "color:var(--muted);font-size:12px;padding:6px";
    return;
  }
  if (myid !== searchseq) return;
  us.forEach((u) => {
    if (usermode === "invite" && u.status !== "friend") return;
    const row = el("div", "uresult");
    row.appendChild(avatarnode(u, "width:30px;height:30px;font-size:13px"));
    const nm = el("span", "un", u.username);
    const bd = badgenode(u);
    if (bd) nm.appendChild(bd);
    if (usermode === "friends") {
      const st = { none: "", friend: " · friends", outgoing: " · request sent", incoming: " · wants to be friends" }[u.status] || "";
      nm.appendChild(el("span", "st", st));
    }
    row.appendChild(nm);

    if (usermode === "invite") {
      const g = groups.list.find((x) => x.id === invgid);
      const inGroup = g && g.members.some((mm) => mm.username === u.username);
      const b = el("button", "sbtn", inGroup ? "in group" : "add");
      if (inGroup) b.classList.add("ghost");
      b.onclick = () =>
        api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/groups/invite", { groupid: invgid, username: u.username })
          .then(async () => {
            toast("invited " + u.username);
            await loadside();
            renderpanel();
            b.textContent = "in group";
            b.classList.add("ghost");
            b.onclick = null;
          })
          .catch((e2) => toast(e2.message));
      row.appendChild(b);
    } else {
      if (u.status === "incoming") {
        const yes = el("button", "sbtn", "accept");
        yes.onclick = async () => {
          try {
            await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/friends/respond", { username: u.username, accept: true });
            await loadside();
            runsearch($("userSearch").value);
          } catch (e2) { toast(e2.message); }
        };
        row.appendChild(yes);
      } else if (u.status === "none") {
        const b = el("button", "sbtn", "add friend");
        b.onclick = () =>
          api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/friends/request", { username: u.username })
            .then(() => {
              toast("request sent to " + u.username);
              runsearch($("userSearch").value);
            })
            .catch((e2) => toast(e2.message));
        row.appendChild(b);
      }
    }
    box.appendChild(row);
  });
  if (!box.children.length) {
    box.appendChild(el("div", "", usermode === "invite" ? "no friends found, add some first" : "no users found")).style.cssText =
      "color:var(--muted);font-size:12px;padding:6px";
  }
}
$("addFriendBtn").onclick = () => openusers("friends");
$("userSearchGo").onclick = () => runsearch($("userSearch").value.trim());
$("userSearch").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    runsearch($("userSearch").value.trim());
  }
});

function allrooms() {
  const out = [];
  CHANS.forEach((c) => out.push({ label: "# " + c, room: "channel:" + c, kind: "channel" }));
  friends.accepted.forEach((f) => out.push({ label: "@ " + f.username, room: "dm:" + [me.username, f.username].sort().join("::"), av: f }));
  groups.list.forEach((g) => out.push({ label: "# " + g.name, room: "group:" + g.id, kind: "group" }));
  return out;
}

function renderjump(q) {
  const list = $("jumpList");
  list.textContent = "";
  const items = allrooms().filter((r) => r.label.toLowerCase().includes(q.toLowerCase())).slice(0, 12);
  items.forEach((r) => {
    const row = el("div", "jrow");
    if (r.av) row.appendChild(avatarnode(r.av, "width:26px;height:26px;font-size:12px"));
    else row.appendChild(icon(r.kind === "group" ? I.hash : r.room.startsWith("dm:") ? I.smile : I.hash));
    row.appendChild(el("span", "nm", r.label));
    row.onclick = () => {
      $("jumpOv").classList.remove("on");
      openroom(r.room);
    };
    list.appendChild(row);
  });
  if (!items.length) list.appendChild(el("div", "", "nothing matches")).style.cssText = "color:var(--muted);font-size:12px;padding:6px";
}

$("peopleBtn").onclick = () => $("people").classList.toggle("open");

$("settingsBtn").onclick = () => {
  $("settingsOv").classList.add("on");
  if (isstaff()) {
    modsearch("");
    refreshcfg();
  }
};
$("stAcc").onclick = () => {
  $("stAcc").classList.add("on");
  $("stStaff").classList.remove("on");
  $("accTab").style.display = "";
  $("staffTab").style.display = "none";
};
$("stStaff").onclick = () => {
  $("stStaff").classList.add("on");
  $("stAcc").classList.remove("on");
  $("staffTab").style.display = "";
  $("accTab").style.display = "none";
};

function wipelogin() {
  document.cookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  document.cookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure";
  document.cookie = 'sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';
}

paintbeep();
$("beepBtn").onclick = () => {
  beepson = !beepson;
  localStorage.setItem("beepsound", beepson ? "on" : "off");
  paintbeep();
};

$("logoutBtn").onclick = async () => {
  try { await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/logout", {}); } catch {}
  wipelogin();
  location.href = "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/chat.html?bye=" + Date.now();
};

$("passForm").onsubmit = async (e) => {
  e.preventDefault();
  try {
    await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/password", { current: $("curPass").value, new: $("newPass").value });
    toast("password changed, other sessions logged out");
    $("curPass").value = "";
    $("newPass").value = "";
  } catch (e2) { toast(e2.message); }
};

$("avFile").onchange = (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    const z = 256;
    const c = document.createElement("canvas");
    c.width = z;
    c.height = z;
    const g = c.getContext("2d");
    const sc = Math.max(z / img.width, z / img.height);
    const w = img.width * sc;
    const h = img.height * sc;
    g.drawImage(img, (z - w) / 2, (z - h) / 2, w, h);
    const senduri = (q, fallback) => {
      const uri = c.toDataURL(fallback ? "image/jpeg" : "image/webp", q);
      if (uri.length > 3300000 && q > 0.35) return senduri(q - 0.25, fallback || uri.startsWith("data:image/png"));
      return uri;
    };
    const uri = senduri(0.8);
    api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/avatar", { avatar: uri })
      .then(async () => {
        me.avatar = uri;
        await loadside();
        startav();
        toast("pfp updated");
      })
      .catch((e2) => toast(e2.message));
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    toast("couldnt read that image");
  };
  img.src = url;
};

function startav() {
  const a = avatarnode(me);
  $("myAv").replaceWith(a);
  a.id = "myAv";
  const b = avatarnode(me, "width:52px;height:52px;font-size:22px");
  $("setAv").replaceWith(b);
  b.id = "setAv";
}

let regopen = true;
async function modsearch(q) {
  const myid = ++modseq;
  const box = $("modResults");
  box.textContent = "";
  try {
    const r = await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/mod/users?q=" + encodeURIComponent(q));
    if (myid !== modseq) return;
    (r.users || []).forEach((u) => {
      const row = el("div", "uresult");
      const nm = el("span", "un", u.username);
      const bd = badgenode(u);
      if (bd) nm.appendChild(bd);
      if (u.muteduntil && (u.muteduntil > Date.now() || u.muteduntil === 0)) nm.appendChild(el("span", "edited", " · muted"));
      row.appendChild(nm);
      if (isowner() && u.username !== me.username && u.role !== "owner") {
        const sel = document.createElement("select");
        ["user", "mod"].forEach((rr) => {
          const o = el("option", null, rr);
          o.value = rr;
          if (u.role === rr) o.selected = true;
          sel.appendChild(o);
        });
        sel.onchange = () =>
          api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/mod/setrole", { username: u.username, role: sel.value })
            .then(() => toast("role updated"))
            .catch((e) => toast(e.message));
        row.appendChild(sel);
      }
      const muted = u.muteduntil && (u.muteduntil > Date.now() || u.muteduntil === 0);
      if (!muted) {
        const dur = document.createElement("select");
        [["600000", "10m"], ["3600000", "1h"], ["86400000", "1d"], ["0", "forever"]].forEach(([v, l]) => {
          const o = el("option", null, l);
          o.value = v;
          dur.appendChild(o);
        });
        const mb = el("button", "sbtn", "mute");
        mb.onclick = () =>
          api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/mod/mute", { username: u.username, duration: Number(dur.value) })
            .then(() => {
              toast("muted " + u.username);
              modsearch($("modSearch").value);
            })
            .catch((e) => toast(e.message));
        row.appendChild(dur);
        row.appendChild(mb);
      } else {
        const ub = el("button", "sbtn ghost", "unmute");
        ub.onclick = () =>
          api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/mod/unmute", { username: u.username })
            .then(() => {
              toast("unmuted " + u.username);
              modsearch($("modSearch").value);
            })
            .catch((e) => toast(e.message));
        row.appendChild(ub);
      }
      if (u.role !== "owner" && u.username !== me.username) {
        const da = el("button", "sbtn warn", "del");
        da.onclick = () =>
          askConfirm("delete account " + u.username + " forever?", () =>
            api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/mod/delete-account", { username: u.username })
              .then(() => {
                toast("deleted " + u.username);
                modsearch($("modSearch").value);
              })
              .catch((e) => toast(e.message))
          );
        row.appendChild(da);
      }
      box.appendChild(row);
    });
    if (!(r.users || []).length) {
      box.appendChild(el("div", "", "no users found")).style.cssText = "color:var(--muted);font-size:12px;padding:6px 10px";
    }
  } catch {}
}
$("modGo").onclick = () => modsearch($("modSearch").value.trim());
$("modSearch").addEventListener("keydown", (e) => {
  if (e.key === "Enter") modsearch($("modSearch").value.trim());
});

$("wipeBtn").onclick = () => {
  const name = $("wipeUser").value.trim().toLowerCase();
  if (!name) return toast("type a username first");
  askConfirm("wipe every message sent by " + name + "?", () =>
    api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/mod/wipe", { username: name })
      .then((r) => {
        toast("wiped " + r.count + " messages");
        $("wipeUser").value = "";
      })
      .catch((e) => toast(e.message))
  );
};

function paintlock() {
  const b = $("lockBtn");
  if (!b) return;
  b.textContent = locked ? "locked" : "unlocked";
  b.className = locked ? "sbtn warn" : "sbtn";
}
$("lockBtn").onclick = () =>
  api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/mod/lock", { locked: !locked })
    .then((r) => {
      locked = r.locked;
      paintlock();
      applyentry();
      toast(locked ? "chat locked" : "chat unlocked");
    })
    .catch((e) => toast(e.message));

async function refreshcfg() {
  try {
    const c = await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/config");
    regopen = !!c.regopen;
    locked = !!c.locked;
    paintreg();
    paintlock();
    applyentry();
  } catch {}
}

function paintreg() {
  $("regBtn").textContent = regopen ? "on" : "off";
  $("regBtn").className = regopen ? "sbtn" : "sbtn warn";
}
$("regBtn").onclick = () =>
  api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/mod/reg", { open: !regopen })
    .then(() => {
      regopen = !regopen;
      paintreg();
    })
    .catch((e) => toast(e.message));

let authmode = "login";
$("tabLogin").onclick = () => setauth("login");
$("tabReg").onclick = () => setauth("register");
function setauth(m) {
  authmode = m;
  $("tabLogin").classList.toggle("on", m === "login");
  $("tabReg").classList.toggle("on", m === "register");
  $("authGo").textContent = m === "login" ? "log in" : "create account";
  $("authPass").autocomplete = m === "login" ? "current-password" : "new-password";
  loadcaptcha();
}
$("authForm").onsubmit = async (e) => {
  e.preventDefault();
  const u = $("authUser").value.trim().toLowerCase();
  const p = $("authPass").value;
  if (!u || !p) return toast("fill everything out");
  if (!/^[a-z0-9_]{2,20}$/.test(u)) return toast("username: letters, numbers, underscores only");
  if (REQUIRECAP && !capToken) {
    $("capWrap").style.display = "flex";
    const wd = $("capWidget");
    if (wd && typeof wd.reset === "function") { try { wd.reset(); } catch {} }
    if (!capPending) {
      capPending = true;
      toast("verifying captcha...");
    }
    return;
  }
  try {
    await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/" + (authmode === "login" ? "login" : "register"), {
      username: u,
      password: p,
      captchatoken: capToken,
    });
    me = await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/me");
    startapp();
  } catch (e2) {
    toast(e2.message);
    loadcaptcha();
  }
};

bindcap();

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    $("jumpSearch").value = "";
    renderjump("");
    $("jumpOv").classList.add("on");
    $("jumpSearch").focus();
    return;
  }
  if (e.key !== "Escape") return;
  document.querySelectorAll(".overlay.on").forEach((o) => o.classList.remove("on"));
  document.querySelectorAll(".emotes.open").forEach((x) => x.classList.remove("open"));
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".acts") && !e.target.closest(".emotes")) {
    document.querySelectorAll(".emotes.open").forEach((x) => x.classList.remove("open"));
  }
});

$("jumpSearch").addEventListener("input", () => renderjump($("jumpSearch").value));
$("jumpSearch").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const rows = $("jumpList").querySelectorAll(".jrow");
    if (rows[0]) rows[0].click();
  }
});

document.querySelectorAll("[data-close]").forEach((b) => (b.onclick = () => b.closest(".overlay").classList.remove("on")));
$("confirmNo").onclick = () => {
  $("confirmOv").classList.remove("on");
  $("confirmYes").textContent = "do it";
};
$("inputNo") && ($("inputNo").onclick = () => $("inputOv").classList.remove("on"));
document.querySelectorAll(".overlay").forEach((o) =>
  o.addEventListener("click", (e) => {
    if (e.target === o) o.classList.remove("on");
  })
);

async function boot() {
  if (new URLSearchParams(location.search).has("bye")) {
    history.replaceState(null, "", "https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/chat.html");
    wipelogin();
    $("auth").classList.add("on");
    loadcaptcha();
    return;
  }
  try {
    const meta = await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/meta");
    if (Array.isArray(meta.chans) && meta.chans.length) CHANS = meta.chans;
    if (Array.isArray(meta.emojis) && meta.emojis.length) EMOJI = meta.emojis;
    REQUIRECAP = meta.cap !== false;
  } catch {}
  try { me = await api("https://cdn.jsdelivr.net/gh/muffinisgoated/jsdelivrrr@main/api/me"); } catch { me = null; }
  if (me) startapp();
  else {
    $("auth").classList.add("on");
    loadcaptcha();
  }
}

async function startapp() {
  $("auth").classList.remove("on");
  $("app").classList.add("on");
  startav();
  paintme();
  connect();
  await loadside();
  refreshcfg();
  await openroom(room);
  appready = true;
}

boot();

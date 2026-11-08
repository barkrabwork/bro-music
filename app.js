"use strict";
(() => {
  const CFG = window.CONFIG || {};
  const BASE = (CFG.MUSIC_BASE_URL || "./").replace(/\/*$/, "/");
  // старое название из config.js, который уже лежит в репозитории, заменяем новым
  const NEW_DAYS = Number(CFG.NEW_DAYS) || 14; // сколько дней трек считается новым
  const SITE = CFG.SITE_TITLE && !["Bro Music", "Villa Vibe"].includes(CFG.SITE_TITLE) ? CFG.SITE_TITLE : "Villa Vibe Mixtapes";
  // карточка для темы PromoDJ (можно переопределить в config.js: PROFILE: ["строка 1", "строка 2"])
  const PROFILE = CFG.PROFILE || [
    "Алексей Литвяков",
    "Основной стиль: Techno",
    "Любимые стили: Deep House, Dub Techno, Hard Techno, House, Tropical House",
    "DJ, клаббер, слушатель",
    "Дислокация: Россия, Санкт-Петербург",
  ];

  /* ---------------------------------------------------------------- icons */
  const PATHS = {
    play: "M8 5v14l11-7z",
    pause: "M6 5h4v14H6zM14 5h4v14h-4z",
    prev: "M6 6h2v12H6zM9.5 12 18 6v12z",
    next: "M16 6h2v12h-2zM6 18V6l8.5 6z",
    shuffle: "M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z",
    repeat: "M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z",
    heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    plus: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    timer: "M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.96 8.96 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z",
    volume: "M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z",
    mute: "M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z",
    settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
    down: "M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z",
    link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
    help: "M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z",
  };
  const icon = (name, cls = "") =>
    `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ""}><path d="${PATHS[name]}"/></svg>`;

  /* -------------------------------------------------------------- helpers */
  const $ = (sel, root = document) => root.querySelector(sel);

  function h(tag, props = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(kid));
    }
    return el;
  }

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem("bro." + key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem("bro." + key, JSON.stringify(value));
      } catch (e) {
        /* storage unavailable: features still work for the session */
      }
    },
    remove(key) {
      try {
        localStorage.removeItem("bro." + key);
      } catch (e) {
        /* ignore */
      }
    },
  };

  const urlOf = (path) => BASE + path.split("/").map(encodeURIComponent).join("/");
  const capital = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
  const prettify = (s) => capital(s.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim());
  const folderTitle = (f) => (f ? f.split("/").map(prettify).join(" / ") : "Без подборки");
  const clamp01 = (x) => Math.min(1, Math.max(0, x));

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    sec = Math.floor(sec);
    const hh = Math.floor(sec / 3600);
    const mm = Math.floor((sec % 3600) / 60);
    const ss = String(sec % 60).padStart(2, "0");
    return hh ? `${hh}:${String(mm).padStart(2, "0")}:${ss}` : `${mm}:${ss}`;
  }

  function hash(s) {
    let x = 2166136261;
    for (let i = 0; i < s.length; i++) {
      x ^= s.charCodeAt(i);
      x = Math.imul(x, 16777619);
    }
    return x >>> 0;
  }
  const gradient = (id) => {
    const a = hash(id) % 360;
    return `linear-gradient(135deg, hsl(${a} 65% 45%), hsl(${(a + 50) % 360} 70% 28%))`;
  };

  function fakePeaks(id) {
    let s = hash(id);
    let v = 50;
    const out = [];
    for (let i = 0; i < 200; i++) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      v = Math.max(15, Math.min(100, v + ((s >>> 24) / 255 - 0.5) * 40));
      out.push(Math.round(v));
    }
    return out;
  }

  /* ---------------------------------------------------------------- state */
  const audio = $("#audio");
  const mqWide = window.matchMedia("(min-width: 1280px)");
  const isWide = () => mqWide.matches;

  const state = {
    tracks: [],
    byId: new Map(),
    favs: new Set(store.get("favs", [])),
    playlists: store.get("playlists", []),
    view: { type: "all" },
    query: "",
    cur: null,
    queue: [],
    visible: [],
    history: [],
    shuffle: false,
    repeat: "off",
    sleep: null,
    info: null,
  };
  const waves = new Map();
  let pendingSeek = 0; // доля трека (0..1), на которую перемотать после загрузки
  let pendingTime = 0; // секунда, на которую перемотать после загрузки (ссылка с &t=)
  let dragging = false;
  let wmDrag = false; // тянут полосу перемотки в плеере темы VHS
  let cxDrag = false; // то же в деке темы «Кассета»
  let lfDrag = false; // и в теме Lo-Fi
  let rmDrag = false; // и в теме «Рим»
  let sleepTimer = null;

  const isNew = (t) => !!t.added && Date.now() - t.added < NEW_DAYS * 864e5;
  const saveFavs = () => store.set("favs", [...state.favs]);
  const savePlaylists = () => store.set("playlists", state.playlists);
  const curTrack = () => (state.cur ? state.byId.get(state.cur) : null);

  function duration() {
    if (isFinite(audio.duration) && audio.duration > 0) return audio.duration;
    return (curTrack() && curTrack().duration) || 0;
  }

  /* ----------------------------------------------------------------- data */
  function normalize(raw) {
    const list = Array.isArray(raw) ? raw : raw.tracks || [];
    return list
      .filter((t) => t && t.id)
      .map((t) => {
        const parts = t.id.split("/");
        const file = parts.pop();
        return {
          id: t.id,
          title: t.title || prettify(file),
          folder: t.folder != null ? t.folder : parts.join("/"),
          duration: Number(t.duration) || 0,
          peaks: Array.isArray(t.peaks) && t.peaks.length ? t.peaks : fakePeaks(t.id),
          cover: t.cover || null,
          added: t.added ? Date.parse(t.added) || 0 : 0,
          ext: (file.match(/\.[^.]+$/) || [""])[0],
        };
      });
  }

  async function load() {
    try {
      const res = await fetch(BASE + "tracks.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      state.tracks = normalize(await res.json());
      state.byId = new Map(state.tracks.map((t) => [t.id, t]));
    } catch (e) {
      $("#content").replaceChildren(
        h("div", { class: "empty" }, "Не удалось загрузить список треков. Проверьте подключение и адрес хранилища в config.js.")
      );
      return;
    }
    renderSidebar();
    renderContent();
    openFromHash();
    updateNowPlaying();
  }

  /* Ссылка index.html#track=<путь>&t=<секунды> открывает трек (и нужный момент), без автозапуска. */
  function parseHash() {
    if (!location.hash.startsWith("#")) return null;
    let p;
    try {
      p = new URLSearchParams(location.hash.slice(1));
    } catch (e) {
      return null;
    }
    const id = p.get("track");
    if (!id || !state.byId.has(id)) return null;
    const t = Math.floor(Number(p.get("t")));
    return { id, t: isFinite(t) && t > 0 ? t : 0 };
  }

  function openFromHash() {
    const lk = parseHash();
    if (!lk) return;
    if (state.cur !== lk.id) {
      state.cur = lk.id;
      state.queue = state.visible.slice();
      pendingSeek = 0;
      pendingTime = lk.t;
      audio.preload = lk.t ? "metadata" : "none";
      setAudioCors();
      audio.src = urlOf(lk.id);
      if (lk.t) audio.load();
    } else if (lk.t) {
      if (audio.readyState > 0) audio.currentTime = lk.t;
      else {
        pendingTime = lk.t;
        audio.preload = "metadata";
        audio.load();
      }
    }
    if (!isWide()) openNp();
  }

  /* --------------------------------------------------------- share link */
  function linkFor(id, t) {
    return location.href.split("#")[0] + "#track=" + encodeURIComponent(id) + (t > 0 ? "&t=" + Math.floor(t) : "");
  }

  function showLink(url) {
    const input = h("input", { class: "field", type: "text", readonly: true, value: url, "aria-label": "Ссылка" });
    const box = h(
      "div",
      { class: "modal-box" },
      h("h3", { class: "modal-title" }, "Скопируйте ссылку"),
      input,
      h("div", { class: "modal-actions" }, h("button", { class: "btn", onclick: () => close() }, "Закрыть"))
    );
    const close = openModal(box);
    input.select();
  }

  async function copyLink(url, okText) {
    try {
      await navigator.clipboard.writeText(url);
      toast(okText);
      return;
    } catch (e) {
      /* нет доступа к буферу обмена: пробуем запасной способ */
    }
    const ta = h("textarea", { style: "position:fixed;left:-9999px;top:0", "aria-hidden": "true" });
    ta.value = url;
    document.body.append(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    ta.remove();
    if (ok) toast(okText);
    else showLink(url);
  }

  function shareMenu(anchor) {
    if (!state.cur) return;
    const id = state.cur;
    const t = Math.floor(audio.currentTime || 0);
    const items = [{ label: "Ссылка на трек", onClick: () => copyLink(linkFor(id, 0), "Ссылка на трек скопирована") }];
    if (t >= 1) items.push({ label: `Ссылка на момент ${fmt(t)}`, onClick: () => copyLink(linkFor(id, t), `Ссылка на момент ${fmt(t)} скопирована`) });
    openMenu(anchor, items, "Скопировать ссылку");
  }

  function setHash(id) {
    try {
      history.replaceState(null, "", "#track=" + encodeURIComponent(id));
    } catch (e) {
      /* file:// and some sandboxes forbid it */
    }
  }

  /* --------------------------------------------------------------- covers */
  // Заполняет обложкой блок d. Картинка приезжает позже, поэтому добавляем её прямо в d
  // (а не в промежуточный элемент) и только если в блоке всё ещё этот же трек.
  function fillCover(d, t) {
    d.dataset.cid = t.id;
    d.style.background = gradient(t.id);
    d.replaceChildren(h("span", { class: "cover-letter" }, (t.title[0] || "♪").toUpperCase()));
    const img = new Image();
    img.alt = "";
    img.decoding = "async";
    img.onload = () => {
      if (d.dataset.cid === t.id) d.append(img);
    };
    img.src = urlOf(t.cover || t.id.replace(/\.[^./]+$/, "") + ".jpg");
    return d;
  }
  function coverEl(t, extra) {
    return fillCover(h("div", { class: "cover " + (extra || "") }), t);
  }

  /* ------------------------------------------------------------- waveform */
  const cssVar = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

  function drawWave(canvas, peaks, frac, marks, dur) {
    const w = canvas.clientWidth;
    const hgt = canvas.clientHeight;
    if (!w || !hgt) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(hgt * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(hgt * dpr);
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, hgt);
    const step = 4;
    const n = Math.floor(w / step);
    const base = hgt * 0.7;
    const accent = cssVar("--accent", "#f50");
    const idle = cssVar("--wave", "#777");
    for (let i = 0; i < n; i++) {
      const p = peaks[Math.min(peaks.length - 1, Math.floor((i / n) * peaks.length))] / 100;
      const bh = Math.max(2, p * base);
      const x = i * step;
      ctx.fillStyle = i / n < frac ? accent : idle;
      ctx.fillRect(x, base - bh, 3, bh);
      ctx.globalAlpha = 0.3;
      ctx.fillRect(x, base + 1, 3, Math.max(1, bh * 0.4));
      ctx.globalAlpha = 1;
    }
    if (marks && marks.length && dur > 0) {
      ctx.fillStyle = cssVar("--icon-strong", "#fff");
      ctx.strokeStyle = cssVar("--bg", "#111");
      ctx.lineWidth = 1.5;
      for (const m of marks) {
        if (m.t > dur) continue;
        ctx.beginPath();
        ctx.arc(Math.min(w - 4, Math.max(4, (m.t / dur) * w)), base, 3.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
      }
    }
  }

  const progressFrac = () => (duration() ? Math.min(1, audio.currentTime / duration()) : 0);
  const currentMarks = () => (state.info && state.info.id === state.cur ? state.info.marks : []);

  function redrawWave(id) {
    const w = waves.get(id);
    if (!w) return;
    const own = id === state.cur;
    drawWave(w.canvas, w.peaks, own ? progressFrac() : 0, own ? currentMarks() : null, duration());
  }

  function redrawNpWave() {
    const c = $("#npCanvas");
    const t = curTrack();
    if (!t) {
      c.getContext("2d").clearRect(0, 0, c.width, c.height);
      return;
    }
    drawWave(c, t.peaks, progressFrac(), currentMarks(), duration());
  }

  function redrawAllWaves() {
    waves.forEach((_, id) => redrawWave(id));
    redrawNpWave();
  }

  /* --------------------------------------------------------------- sidebar */
  function viewIs(v) {
    return state.view.type === v.type && state.view.key === v.key;
  }

  function setView(v) {
    state.view = v;
    state.query = "";
    $("#search").value = "";
    renderSidebar();
    renderContent();
    $("#content").scrollTop = 0;
  }

  function navItem(label, count, view) {
    return h(
      "button",
      { class: "nav-item" + (viewIs(view) ? " active" : ""), onclick: () => setView(view) },
      h("span", {}, label),
      h("span", { class: "count" }, count)
    );
  }

  function renderSidebar() {
    const nav = $("#sidebar");
    nav.replaceChildren();
    nav.append(h("div", { class: "side-logo", role: "img", "aria-label": SITE }));
    const validFavs = [...state.favs].filter((id) => state.byId.has(id)).length;
    nav.append(
      navItem("Все треки", state.tracks.length, { type: "all" }),
      navItem("Избранное", validFavs, { type: "fav" })
    );
    const newCount = state.tracks.filter(isNew).length;
    if (newCount) nav.append(navItem("Новое", newCount, { type: "new" }));

    const folders = [...new Set(state.tracks.map((t) => t.folder).filter(Boolean))];
    if (folders.length) {
      nav.append(h("div", { class: "nav-label" }, h("span", {}, "Подборки")));
      for (const f of folders) {
        nav.append(navItem(folderTitle(f), state.tracks.filter((t) => t.folder === f).length, { type: "folder", key: f }));
      }
    }

    nav.append(
      h(
        "div",
        { class: "nav-label" },
        h("span", {}, "Плейлисты"),
        h("button", { "aria-label": "Новый плейлист", title: "Новый плейлист", html: icon("plus"), onclick: () => createPlaylist() })
      )
    );
    if (!state.playlists.length) nav.append(h("div", { class: "nav-hint" }, "Пока нет плейлистов"));
    for (const pl of state.playlists) {
      const n = pl.tracks.filter((id) => state.byId.has(id)).length;
      nav.append(navItem(pl.name, n, { type: "pl", key: pl.id }));
    }
    nav.append(
      h("div", { class: "side-contacts" }, h("div", { class: "side-contacts-title" }, "Контакты"), ...PROFILE.map((line, i) => h("div", { class: i === 0 ? "side-contacts-name" : "" }, line)))
    );
  }

  /* ---------------------------------------------------------- track lists */
  function viewTracks() {
    const v = state.view;
    let list;
    if (v.type === "fav") list = [...state.favs].map((id) => state.byId.get(id)).filter(Boolean);
    else if (v.type === "pl") {
      const pl = state.playlists.find((p) => p.id === v.key);
      list = pl ? pl.tracks.map((id) => state.byId.get(id)).filter(Boolean) : [];
    } else if (v.type === "folder") list = state.tracks.filter((t) => t.folder === v.key);
    else if (v.type === "new") list = state.tracks.filter(isNew);
    else list = state.tracks;

    const q = state.query.trim().toLowerCase();
    if (q) list = list.filter((t) => t.title.toLowerCase().includes(q) || folderTitle(t.folder).toLowerCase().includes(q));
    return list;
  }

  function viewTitle() {
    const v = state.view;
    if (v.type === "fav") return "Избранное";
    if (v.type === "new") return "Новое";
    if (v.type === "folder") return folderTitle(v.key);
    if (v.type === "pl") {
      const pl = state.playlists.find((p) => p.id === v.key);
      return pl ? pl.name : "Плейлист";
    }
    return "Все треки";
  }

  function emptyText() {
    if (state.query.trim()) return "Ничего не найдено.";
    if (state.view.type === "new") return "Новых сетов пока нет.";
    if (state.view.type === "fav") return "Нажмите ♥ у трека, чтобы добавить его в избранное.";
    if (state.view.type === "pl") return "Плейлист пуст. Добавляйте треки кнопкой «+» у трека.";
    return "В хранилище пока нет треков.";
  }

  function renderContent() {
    const c = $("#content");
    c.replaceChildren();
    waves.clear();

    const list = viewTracks();
    const v = state.view;

    const head = h("div", { class: "view-head" }, h("h1", {}, viewTitle()), h("span", { class: "sub" }, `${list.length} ${plural(list.length)}`), h("span", { class: "spacer" }));
    if (v.type === "pl") {
      head.append(
        h("button", { class: "btn ghost", onclick: () => renamePlaylist(v.key) }, "Переименовать"),
        h("button", { class: "btn ghost", onclick: () => deletePlaylist(v.key) }, "Удалить")
      );
    }
    c.append(head);

    if (!list.length) {
      state.visible = [];
      c.append(h("div", { class: "empty" }, emptyText()));
      return;
    }

    const grouped = v.type === "all" && new Set(list.map((t) => t.folder)).size > 1;
    if (grouped) {
      const groups = new Map();
      for (const t of list) {
        if (!groups.has(t.folder)) groups.set(t.folder, []);
        groups.get(t.folder).push(t);
      }
      state.visible = [...groups.values()].flat().map((t) => t.id);
      for (const [folder, items] of groups) {
        c.append(h("h2", { class: "group-title" }, folderTitle(folder)));
        items.forEach((t) => c.append(row(t)));
      }
    } else {
      state.visible = list.map((t) => t.id);
      list.forEach((t) => c.append(row(t)));
    }

    head.append(h("button", { class: "btn", onclick: () => playTrack(state.visible[0], { queue: state.visible.slice() }) }, "Слушать"));
    requestAnimationFrame(() => {
      redrawAllWaves();
      updateRows();
    });
  }

  function plural(n) {
    const a = n % 10;
    const b = n % 100;
    if (a === 1 && b !== 11) return "трек";
    if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return "трека";
    return "треков";
  }

  function row(t) {
    const canvas = h("canvas", { "aria-label": "Волновая форма" });
    const wave = h("div", { class: "wave", title: "Нажмите, чтобы перемотать" }, canvas);
    wave.addEventListener("click", (e) => {
      const r = canvas.getBoundingClientRect();
      let frac = clamp01((e.clientX - r.left) / r.width);
      if (state.cur === t.id) {
        const m = markNear(canvas, e.clientX);
        if (m && duration()) frac = clamp01(m.t / duration());
        seekFrac(frac);
      } else playTrack(t.id, { frac, queue: state.visible.slice() });
    });
    bindWaveTip(wave, canvas, () => t.id === state.cur);
    waves.set(t.id, { canvas, peaks: t.peaks });

    const title = h("button", {
      class: "row-title",
      title: t.title,
      onclick: () => {
        if (state.cur !== t.id) playTrack(t.id, { queue: state.visible.slice() });
        if (!isWide()) openNp();
      },
    }, t.title);

    const favBtn = h("button", { class: "icon-btn fav-btn", "data-fav": t.id, "aria-label": "В избранное", title: "В избранное", html: icon("heart"), onclick: () => toggleFav(t.id) });
    const addBtn = h("button", { class: "icon-btn js-menu-btn", "aria-label": "Добавить в плейлист", title: "Добавить в плейлист", html: icon("plus") });
    addBtn.addEventListener("click", () => playlistMenu(addBtn, t.id));

    const playBtn = h("button", { class: "cover-play", "aria-label": "Играть / пауза", html: icon("play", "i-play") + icon("pause", "i-pause") });
    playBtn.addEventListener("click", () => toggleTrack(t.id, state.visible.slice()));

    return h(
      "article",
      { class: "row", "data-id": t.id },
      h("div", { class: "row-cover" }, coverEl(t), playBtn),
      h("div", { class: "row-body" }, h("div", { class: "row-top" }, title, isNew(t) ? h("span", { class: "badge-new" }, "Новое") : null, h("div", { class: "row-folder" }, folderTitle(t.folder))), wave),
      h("div", { class: "row-side" }, h("div", { class: "row-actions" }, favBtn, addBtn), h("span", { class: "row-dur" }, t.duration ? fmt(t.duration) : ""))
    );
  }

  function updateRows() {
    const playing = !audio.paused && !audio.ended;
    document.querySelectorAll(".row").forEach((el) => {
      const active = el.dataset.id === state.cur;
      el.classList.toggle("active", active);
      el.classList.toggle("is-playing", active && playing);
    });
    document.querySelectorAll("[data-fav]").forEach((el) => el.classList.toggle("on", state.favs.has(el.dataset.fav)));
  }

  /* ------------------------------------------------------------ favorites */
  function syncFavUI() {
    const on = !!state.cur && state.favs.has(state.cur);
    $("#pFav").classList.toggle("on", on);
    $("#npFav").classList.toggle("on", on);
    $("#wmFav").classList.toggle("on", on);
    $("#cxFav").classList.toggle("on", on);
    $("#lfFav").classList.toggle("on", on);
    $("#rmFav").classList.toggle("on", on);
  }

  function toggleFav(id) {
    if (state.favs.has(id)) state.favs.delete(id);
    else state.favs.add(id);
    saveFavs();
    syncFavUI();
    updateRows();
    renderSidebar();
    if (state.view.type === "fav") renderContent();
  }

  /* --------------------------------------------------------------- dialogs */
  function openModal(box, onClose) {
    const back = h("div", { class: "modal-backdrop" }, box);
    const prevFocus = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    };
    function close() {
      if (!back.isConnected) return;
      back.remove();
      document.removeEventListener("keydown", onKey, true);
      if (prevFocus && prevFocus.focus) prevFocus.focus();
      if (onClose) onClose();
    }
    back.addEventListener("pointerdown", (e) => {
      if (e.target === back) close();
    });
    document.addEventListener("keydown", onKey, true);
    document.body.append(back);
    const first = box.querySelector("input:not([type=file]), button");
    if (first) first.focus({ preventScroll: true });
    return close;
  }

  function askText({ title, value = "", ok = "Готово", placeholder = "" }) {
    return new Promise((resolve) => {
      let done = false;
      let close = () => {};
      const finish = (v) => {
        if (done) return;
        done = true;
        close();
        resolve(v);
      };
      const input = h("input", { class: "field", type: "text", value, placeholder, maxlength: "60", "aria-label": title });
      const form = h(
        "form",
        {
          class: "modal-box",
          onsubmit: (e) => {
            e.preventDefault();
            const v = input.value.trim();
            if (v) finish(v);
          },
        },
        h("h3", { class: "modal-title" }, title),
        input,
        h("div", { class: "modal-actions" }, h("button", { type: "button", class: "btn ghost", onclick: () => finish(null) }, "Отмена"), h("button", { type: "submit", class: "btn" }, ok))
      );
      close = openModal(form, () => finish(null));
      input.select();
    });
  }

  function askConfirm({ title, text, ok = "Удалить" }) {
    return new Promise((resolve) => {
      let done = false;
      let close = () => {};
      const finish = (v) => {
        if (done) return;
        done = true;
        close();
        resolve(v);
      };
      const box = h(
        "div",
        { class: "modal-box" },
        h("h3", { class: "modal-title" }, title),
        h("p", { class: "modal-text" }, text),
        h("div", { class: "modal-actions" }, h("button", { class: "btn ghost", onclick: () => finish(false) }, "Отмена"), h("button", { class: "btn danger", onclick: () => finish(true) }, ok))
      );
      close = openModal(box, () => finish(false));
    });
  }

  /* ------------------------------------------------------------ playlists */
  async function createPlaylist(trackId) {
    const name = await askText({ title: "Новый плейлист", placeholder: "Название плейлиста", ok: "Создать" });
    if (!name) return;
    state.playlists.push({ id: "p" + Date.now().toString(36), name, tracks: trackId ? [trackId] : [] });
    savePlaylists();
    renderSidebar();
    if (state.view.type === "pl") renderContent();
    toast(trackId ? `Добавлено в «${name}»` : `Плейлист «${name}» создан`);
  }

  async function renamePlaylist(key) {
    const pl = state.playlists.find((p) => p.id === key);
    if (!pl) return;
    const name = await askText({ title: "Переименовать плейлист", value: pl.name, ok: "Сохранить" });
    if (!name) return;
    pl.name = name;
    savePlaylists();
    renderSidebar();
    renderContent();
  }

  async function deletePlaylist(key) {
    const pl = state.playlists.find((p) => p.id === key);
    if (!pl) return;
    const ok = await askConfirm({ title: "Удалить плейлист?", text: `Плейлист «${pl.name}» будет удалён. Сами треки останутся в библиотеке.` });
    if (!ok) return;
    state.playlists = state.playlists.filter((p) => p.id !== key);
    savePlaylists();
    setView({ type: "all" });
  }

  function playlistMenu(anchor, trackId) {
    const items = state.playlists.map((pl) => ({
      label: pl.name,
      checked: pl.tracks.includes(trackId),
      onClick: () => {
        const i = pl.tracks.indexOf(trackId);
        if (i >= 0) pl.tracks.splice(i, 1);
        else pl.tracks.push(trackId);
        savePlaylists();
        renderSidebar();
        if (state.view.type === "pl") renderContent();
        toast(i >= 0 ? `Убрано из «${pl.name}»` : `Добавлено в «${pl.name}»`);
      },
    }));
    if (items.length) items.push({ sep: true });
    items.push({ label: "Новый плейлист…", onClick: () => createPlaylist(trackId) });
    openMenu(anchor, items, "Добавить в плейлист");
  }

  /* ---------------------------------------------------------------- menu */
  const menuEl = $("#menu");
  let menuAnchor = null;

  function closeMenu() {
    menuEl.hidden = true;
    menuAnchor = null;
  }

  function openMenu(anchor, items, title) {
    if (!menuEl.hidden && menuAnchor === anchor) return closeMenu();
    menuEl.replaceChildren();
    if (title) menuEl.append(h("div", { class: "menu-title" }, title));
    for (const it of items) {
      if (it.sep) {
        menuEl.append(h("div", { class: "menu-sep" }));
        continue;
      }
      menuEl.append(
        h(
          "button",
          {
            class: "menu-item",
            onclick: () => {
              closeMenu();
              it.onClick();
            },
          },
          h("span", { class: "tick" }, it.checked ? "✓" : ""),
          it.label
        )
      );
    }
    menuAnchor = anchor;
    menuEl.hidden = false;
    if (window.innerWidth > 760) {
      const r = anchor.getBoundingClientRect();
      const mw = menuEl.offsetWidth;
      const mh = menuEl.offsetHeight;
      menuEl.style.left = Math.max(8, Math.min(r.left, window.innerWidth - mw - 8)) + "px";
      const below = r.bottom + 6;
      menuEl.style.top = (below + mh > window.innerHeight - 8 ? Math.max(8, r.top - mh - 6) : below) + "px";
    } else {
      menuEl.style.left = menuEl.style.top = "";
    }
  }

  document.addEventListener("pointerdown", (e) => {
    if (menuEl.hidden) return;
    if (menuEl.contains(e.target) || e.target.closest(".js-menu-btn")) return;
    closeMenu();
  });

  let toastTimer = null;
  function toast(text) {
    const el = $("#toast");
    el.textContent = text;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.hidden = true), 2500);
  }

  /* -------------------------------------------------------------- playback */
  function onPlayError(e) {
    if (e && e.name === "AbortError") return;
    toast("Не удалось воспроизвести трек");
  }

  function playTrack(id, opts = {}) {
    const t = state.byId.get(id);
    if (!t) return;
    if (opts.queue) state.queue = opts.queue;
    else if (!state.queue.includes(id)) state.queue = state.visible.slice();
    if (state.cur && state.cur !== id && !opts.noHistory) {
      state.history.push(state.cur);
      if (state.history.length > 50) state.history.shift();
    }
    state.cur = id;
    pendingSeek = opts.frac || 0;
    pendingTime = 0;
    audio.preload = "none";
    setAudioCors();
    audio.src = urlOf(id);
    audio.play().catch(onPlayError);
    setHash(id);
    updateNowPlaying();
  }

  function toggleTrack(id, queue) {
    if (state.cur === id) {
      if (audio.paused) audio.play().catch(onPlayError);
      else audio.pause();
    } else playTrack(id, { queue });
  }

  function seekFrac(frac) {
    if (!state.cur) return;
    if (audio.readyState === 0) pendingSeek = frac;
    else if (isFinite(audio.duration)) audio.currentTime = frac * audio.duration;
    if (audio.paused) audio.play().catch(onPlayError);
  }

  function next(auto) {
    const q = state.queue;
    if (!q.length) return;
    if (auto && state.repeat === "one") {
      audio.currentTime = 0;
      audio.play().catch(onPlayError);
      return;
    }
    const i = q.indexOf(state.cur);
    let ni;
    if (state.shuffle && q.length > 1) {
      do ni = Math.floor(Math.random() * q.length);
      while (ni === i);
    } else {
      ni = i + 1;
      if (ni >= q.length) {
        if (state.repeat === "all" || !auto) ni = 0;
        else return;
      }
    }
    playTrack(q[ni]);
  }

  function prev() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    if (state.history.length) {
      playTrack(state.history.pop(), { noHistory: true });
      return;
    }
    const q = state.queue;
    if (!q.length) return;
    const i = q.indexOf(state.cur);
    playTrack(q[(i - 1 + q.length) % q.length], { noHistory: true });
  }

  /* ---------------------------------------------------------------- sleep */
  function setSleep(mode) {
    clearTimeout(sleepTimer);
    state.sleep = null;
    if (mode === "end") state.sleep = { end: true };
    else if (typeof mode === "number") {
      state.sleep = { until: Date.now() + mode * 60000 };
      sleepTimer = setTimeout(() => {
        audio.pause();
        state.sleep = null;
        updateSleepUI();
        toast("Таймер сна: воспроизведение остановлено");
      }, mode * 60000);
    }
    updateSleepUI();
  }

  function updateSleepUI() {
    const s = state.sleep;
    $("#bSleep").classList.toggle("on", !!s);
    let label = "";
    if (s && s.end) label = "трек";
    else if (s && s.until) label = Math.max(1, Math.ceil((s.until - Date.now()) / 60000)) + "м";
    $("#sleepLabel").textContent = label;
  }

  function sleepMenu() {
    const s = state.sleep;
    const item = (label, mode, checked) => ({ label, checked, onClick: () => setSleep(mode) });
    openMenu($("#bSleep"), [
      item("Выключен", null, !s),
      item("15 минут", 15, false),
      item("30 минут", 30, false),
      item("1 час", 60, false),
      item("До конца трека", "end", !!(s && s.end)),
    ], "Таймер сна");
  }

  /* ------------------------------------------- description and time marks (.txt) */
  // Файл лежит рядом с треком: set-01.mp3 -> set-01.txt. Формат описан в _шаблон.txt и help.js.
  const MARK_RE = /^\s*(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?!\d)[\s\-–—:.)\]]*(.*)$/;

  function parseInfo(text) {
    const descLines = [];
    const items = [];
    let seenMark = false;
    for (const raw of text.replace(/^﻿/, "").split(/\r?\n/)) {
      const line = raw.trim();
      if (line.startsWith("#")) continue;
      const m = MARK_RE.exec(line);
      if (m && +m[3] < 60 && (m[1] === undefined || +m[2] < 60)) {
        const t = (m[1] ? +m[1] : 0) * 3600 + +m[2] * 60 + +m[3];
        items.push({ type: "mark", t, title: m[4].trim() || fmt(t) });
        seenMark = true;
      } else if (!seenMark) descLines.push(line);
      else if (line) items.push({ type: "text", text: line });
    }
    const desc = descLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
    const marks = items.filter((i) => i.type === "mark").sort((a, b) => a.t - b.t);
    return { desc, items, marks, active: -1 };
  }

  async function fetchText(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(buf);
    } catch (e) {
      try {
        return new TextDecoder("windows-1251").decode(buf); // файл сохранён в старой кодировке
      } catch (e2) {
        return null;
      }
    }
  }

  async function loadInfo(id) {
    if (!id) {
      state.info = null;
      renderInfo();
      return;
    }
    if (state.info && state.info.id === id) return;
    state.info = Object.assign(parseInfo(""), { id });
    renderInfo();
    let text = null;
    try {
      text = await fetchText(urlOf(id.replace(/\.[^./]+$/, "") + ".txt"));
    } catch (e) {
      text = null;
    }
    if (!state.info || state.info.id !== id) return;
    state.info = Object.assign(parseInfo(text || ""), { id });
    renderInfo();
  }

  function renderInfo() {
    const box = $("#npInfo");
    const info = state.info;
    box.replaceChildren();
    const has = !!info && info.id === state.cur && (info.desc || info.items.length);
    box.hidden = !has;
    if (has) {
      const win = (title, alt, cls, body, foot) =>
        h(
          "div",
          { class: "np-win " + cls },
          h("div", { class: "np-sec np-win-tb" }, h("span", { class: "grip" }), h("span", { class: "tt-a" }, title), h("span", { class: "tt-b" }, alt), h("span", { class: "grip" }), h("span", { class: "wbtns" }, h("i", {}, "_"), h("i", {}, "×"))),
          h("div", { class: "np-win-body" }, body),
          foot ? h("div", { class: "np-win-foot" }, foot) : null
        );
      if (info.desc) box.append(win("Описание", "Заметки", "w-desc", h("p", { class: "np-desc" }, info.desc)));
      if (info.items.length) {
        const list = h("div", { class: "marks" });
        for (const it of info.items) {
          if (it.type === "text") {
            list.append(h("div", { class: "mark-note" }, it.text));
            continue;
          }
          it.el = h(
            "button",
            {
              class: "mark",
              title: "Перемотать на " + fmt(it.t),
              onclick: () => {
                if (duration()) seekFrac(clamp01(it.t / duration()));
              },
            },
            h("span", { class: "mark-t" }, fmt(it.t)),
            h("span", { class: "mark-name" }, it.title)
          );
          list.append(it.el);
        }
        box.append(win("Метки времени", "Трек-лист", "w-marks", list, `МЕТОК: ${info.marks.length}`));
      }
    }
    renderRmSticks();
    updateActiveMark(true);
    redrawAllWaves();
  }

  function updateActiveMark(force) {
    const info = state.info;
    if (!info || info.id !== state.cur || !info.marks.length) return;
    const cur = audio.currentTime || 0;
    let idx = -1;
    for (let i = 0; i < info.marks.length; i++) {
      if (info.marks[i].t <= cur + 0.25) idx = i;
      else break;
    }
    if (idx === info.active && !force) return;
    info.active = idx;
    info.marks.forEach((m, i) => {
      if (m.el) m.el.classList.toggle("active", i === idx);
      if (m.stick) m.stick.classList.toggle("cur", i === idx);
    });
  }

  function markNear(canvas, clientX) {
    const marks = currentMarks();
    const dur = duration();
    if (!marks.length || !dur) return null;
    const r = canvas.getBoundingClientRect();
    const x = clientX - r.left;
    let best = null;
    let bestD = 9;
    for (const m of marks) {
      if (m.t > dur) continue;
      const d = Math.abs((m.t / dur) * r.width - x);
      if (d < bestD) {
        bestD = d;
        best = m;
      }
    }
    return best;
  }

  const tipEl = $("#waveTip");
  const hideTip = () => {
    tipEl.hidden = true;
  };

  function bindWaveTip(waveEl, canvas, isCurrent) {
    waveEl.addEventListener("mousemove", (e) => {
      const m = isCurrent() ? markNear(canvas, e.clientX) : null;
      if (!m) return hideTip();
      tipEl.replaceChildren(h("b", {}, fmt(m.t)), m.title);
      tipEl.style.left = e.clientX + "px";
      tipEl.style.top = e.clientY - 12 + "px";
      tipEl.hidden = false;
    });
    waveEl.addEventListener("mouseleave", hideTip);
  }

  /* ------------------------------------------------------- now playing page */
  function openNp() {
    if (!state.cur) return;
    document.body.classList.add("np-open");
    requestAnimationFrame(redrawNpWave);
  }

  function closeNp() {
    document.body.classList.remove("np-open");
  }

  function updateNp() {
    const t = curTrack();
    const np = $("#np");
    np.classList.toggle("no-track", !t);
    $("#npTitle").textContent = t ? t.title : "Выберите трек";
    $("#npSub").textContent = t ? folderTitle(t.folder) : "";
    const label = $("#npLabel");
    label.replaceChildren();
    if (t) label.append(coverEl(t));
    $("#cxInkA").textContent = t ? t.title : "";
    $("#cxInkB").textContent = t ? folderTitle(t.folder) : "";
    $("#jcTitle").textContent = t ? t.title : "";
    $("#rmTitle").textContent = t ? t.title : "Выберите трек";
    $("#rmSub").textContent = t ? folderTitle(t.folder) : "";
    if (t) fillCover($("#rmCover"), t);
    else $("#rmCover").replaceChildren();
    $("#jcSub").textContent = t ? folderTitle(t.folder) + " · сторона A" : "";
    fitInk();
    $("#wmTitle").textContent = t ? t.title + "   ***   " + folderTitle(t.folder) + "   ***   " : "Выберите трек";
    loadInfo(t ? t.id : null);
    redrawNpWave();
  }

  /* ------------------------------------------------------------------- UI */
  function updateNowPlaying() {
    const t = curTrack();
    $("#pTitle").textContent = t ? t.title : "Выберите трек";
    $("#pSub").textContent = t ? folderTitle(t.folder) : "";
    const cover = $("#pCover");
    if (t) fillCover(cover, t);
    else {
      cover.replaceChildren();
      cover.style.background = "";
      delete cover.dataset.cid;
    }
    syncFavUI();
    document.title = t ? `${t.title} · ${SITE}` : SITE;
    updateRows();
    updateProgress();
    updateNp();
    redrawAllWaves();
    setMediaSession(t);
  }

  function setPlayingUI() {
    const playing = !audio.paused && !audio.ended;
    const ic = icon(playing ? "pause" : "play");
    $("#bPlay").innerHTML = ic;
    $("#npPlay").innerHTML = ic;
    $("#lfPlay").innerHTML = ic;
    $("#rmPlay").innerHTML = ic;
    $("#bPlay").setAttribute("aria-label", playing ? "Пауза" : "Играть");
    $("#npPlay").setAttribute("aria-label", playing ? "Пауза" : "Играть");
    $("#np").classList.toggle("is-playing", playing);
    syncWm();
    updateRows();
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }

  function setLoading(on) {
    $("#player").classList.toggle("loading", on);
    $("#np").classList.toggle("loading", on);
  }

  // подписи на линейках кассеты: длинное название сжимается по ширине линейки
  function fitInk() {
    for (const id of ["#cxInkA", "#cxInkB"]) {
      const el = $(id);
      el.removeAttribute("textLength");
      if (el.getComputedTextLength() > 570) {
        el.setAttribute("textLength", 570);
        el.setAttribute("lengthAdjust", "spacingAndGlyphs");
      }
    }
  }

  function cxShow(frac, sec) {
    const m = Math.min(99, Math.floor(sec / 60));
    const s = Math.floor(sec % 60);
    const d = $("#cxDigits").children;
    d[0].textContent = Math.floor(m / 10);
    d[1].textContent = m % 10;
    d[3].textContent = Math.floor(s / 10);
    d[4].textContent = s % 10;
    $("#cxSeekFill").style.width = frac * 100 + "%";
    $("#cxSeekThumb").style.left = `calc(${frac * 100}% - ${frac * 16}px)`;
    $("#cxTapeL").setAttribute("r", 70 + 24 * (1 - frac));
    $("#cxTapeR").setAttribute("r", 70 + 24 * frac);
  }

  function rmShow(frac, sec) {
    $("#rmTime").textContent = fmt(sec);
    $("#rmBar").style.setProperty("--p", frac);
  }

  // метки-палочки на полосе прогресса (тема «Рим»)
  function renderRmSticks() {
    const bar = $("#rmBar");
    bar.querySelectorAll("u").forEach((u) => u.remove());
    const info = state.info;
    const dur = duration();
    if (!info || info.id !== state.cur || !dur) return;
    for (const m of info.marks) {
      if (m.t > dur) continue;
      const u = h("u", {
        title: m.title,
        onclick: (e) => {
          e.stopPropagation();
          seekFrac(clamp01(m.t / dur));
        },
      });
      u.style.left = (m.t / dur) * 100 + "%";
      bar.append(u);
      m.stick = u;
    }
    updateActiveMark(true);
  }

  function lfShow(frac, sec) {
    $("#lfTime").textContent = fmt(sec);
    $("#lfTrack").style.setProperty("--p", frac);
  }

  function wmShow(frac, sec) {
    $("#wmTime").textContent = fmt(sec);
    $("#wmProg").style.width = frac * 100 + "%";
    $("#wmThumb").style.left = `calc(${frac * 100}% - ${frac * 18}px)`;
  }

  function syncWm() {
    $("#wmShuf").classList.toggle("on", state.shuffle);
    $("#wmRep").classList.toggle("on", state.repeat !== "off");
    $("#wmRep").textContent = state.repeat === "one" ? "REP 1" : "REP";
    const playing = !audio.paused && !audio.ended;
    $("#cxShuf").classList.toggle("on", state.shuffle);
    $("#cxRep").classList.toggle("on", state.repeat !== "off");
    $("#cxRep").title = { off: "Повтор выключен", all: "Повторять всё", one: "Повторять трек" }[state.repeat];
    $("#cxPlay").classList.toggle("on", playing);
    $("#cxPause").classList.toggle("on", !playing && !!state.cur && audio.currentTime > 0);
    $("#wmSt").innerHTML = playing
      ? '<path d="M1 1v12l10-6z" fill="currentColor"/>'
      : audio.currentTime > 0 && state.cur
      ? '<path d="M1 1h3.5v12H1zM7.5 1H11v12H7.5z" fill="currentColor"/>'
      : '<path d="M1 1h10v12H1z" fill="currentColor"/>';
  }

  function updateProgress() {
    const dur = duration();
    const cur = audio.currentTime || 0;
    $("#tDur").textContent = fmt(dur);
    $("#npDur").textContent = fmt(dur);
    $("#npCur").textContent = fmt(cur);
    if (!wmDrag) wmShow(dur ? Math.min(1, cur / dur) : 0, cur);
    if (!cxDrag) cxShow(dur ? Math.min(1, cur / dur) : 0, cur);
    if (!lfDrag) lfShow(dur ? Math.min(1, cur / dur) : 0, cur);
    if (!rmDrag) rmShow(dur ? Math.min(1, cur / dur) : 0, cur);
    $("#rmDur").textContent = fmt(dur);
    $("#lfDur").textContent = fmt(dur);
    updateActiveMark();
    if (!dragging) {
      $("#tCur").textContent = fmt(cur);
      const seek = $("#seek");
      seek.value = dur ? Math.round((cur / dur) * 1000) : 0;
      seek.style.setProperty("--p", seek.value / 10 + "%");
    }
    if (state.cur) {
      redrawWave(state.cur);
      redrawNpWave();
    }
    if ("mediaSession" in navigator && dur && navigator.mediaSession.setPositionState) {
      try {
        navigator.mediaSession.setPositionState({ duration: dur, position: Math.min(cur, dur), playbackRate: audio.playbackRate || 1 });
      } catch (e) {
        /* some browsers reject odd values */
      }
    }
  }

  function setMediaSession(t) {
    if (!("mediaSession" in navigator) || !t) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: t.title,
        artist: folderTitle(t.folder) || SITE,
        album: SITE,
        artwork: t.cover ? [{ src: new URL(urlOf(t.cover), location.href).href }] : [],
      });
    } catch (e) {
      /* metadata is optional */
    }
  }

  /* ------------------------------------------------------------ visualizer */
  // Включается в настройках. Нужен доступ к звуку по CORS: звук грузится с crossorigin только когда
  // визуализатор включён, а если хранилище не разрешает (ошибка загрузки), он сам выключается.
  const viz = { ctx: null, an: null, src: null, data: null, raf: 0, cors: false, color: "#ff5500", n: 0 };

  function setAudioCors() {
    audio.crossOrigin = settings.vz || viz.src ? "anonymous" : null;
    viz.cors = audio.crossOrigin === "anonymous";
  }

  function ensureViz() {
    if (viz.ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      viz.ctx = new AC();
      viz.src = viz.ctx.createMediaElementSource(audio);
      viz.an = viz.ctx.createAnalyser();
      viz.an.fftSize = 256;
      viz.an.smoothingTimeConstant = 0.82;
      viz.src.connect(viz.an);
      viz.an.connect(viz.ctx.destination);
      viz.data = new Uint8Array(viz.an.frequencyBinCount);
      return true;
    } catch (e) {
      viz.ctx = viz.src = viz.an = null;
      return false;
    }
  }

  function vizFrame() {
    viz.raf = 0;
    const c = $("#viz");
    if (!settings.vz || !viz.an || audio.paused || c.hidden || !(isWide() || document.body.classList.contains("np-open"))) return;
    const w = c.clientWidth, hh = c.clientHeight;
    if (w && hh) {
      const dpr = window.devicePixelRatio || 1;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(hh * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(hh * dpr);
      }
      const x = c.getContext("2d");
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.clearRect(0, 0, w, hh);
      viz.an.getByteFrequencyData(viz.data);
      if (++viz.n % 30 === 1) viz.color = cssVar("--accent", "#ff5500");
      const bars = 40, gap = 3, bw = (w - gap * (bars - 1)) / bars;
      x.fillStyle = viz.color;
      for (let i = 0; i < bars; i++) {
        const v = viz.data[Math.min(viz.data.length - 1, 1 + Math.floor(Math.pow(i / bars, 1.4) * 90))] / 255;
        const bh = Math.max(3, v * hh);
        x.globalAlpha = 0.45 + 0.55 * v;
        x.beginPath();
        if (x.roundRect) x.roundRect(i * (bw + gap), hh - bh, bw, bh, Math.min(3, bw / 2));
        else x.rect(i * (bw + gap), hh - bh, bw, bh);
        x.fill();
      }
      x.globalAlpha = 1;
    }
    viz.raf = requestAnimationFrame(vizFrame);
  }

  function vizKick() {
    const c = $("#viz");
    c.hidden = !(settings.vz && viz.cors);
    if (c.hidden) return;
    if (!ensureViz()) {
      c.hidden = true;
      return;
    }
    if (viz.ctx.state === "suspended") viz.ctx.resume().catch(() => {});
    if (!viz.raf && !audio.paused) viz.raf = requestAnimationFrame(vizFrame);
  }

  /* -------------------------------------------------------------- settings */
  const DEFAULT_SETTINGS = { theme: "dark", hs: 100, ts: 100, accent: "", text: "", bg: "none", bgUrl: "", dim: 55, fl: false, fc: false, fr: false, vz: false };
  const initialSettings = () => Object.assign({}, DEFAULT_SETTINGS, CFG.DEFAULT_SETTINGS || {});
  let settings = Object.assign(initialSettings(), store.get("settings", {}));
  if (settings.theme === "black") settings.theme = "dark"; // «Чёрная» убрали
  let bgObjectUrl = "";

  function idb() {
    return new Promise((resolve, reject) => {
      const rq = indexedDB.open("bro-music", 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore("kv");
      rq.onsuccess = () => resolve(rq.result);
      rq.onerror = () => reject(rq.error);
    });
  }
  async function idbRun(mode, fn) {
    const db = await idb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("kv", mode);
      const rq = fn(tx.objectStore("kv"));
      tx.oncomplete = () => resolve(rq && rq.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  const idbGet = (k) => idbRun("readonly", (s) => s.get(k));
  const idbSet = (k, v) => idbRun("readwrite", (s) => s.put(v, k));
  const idbDel = (k) => idbRun("readwrite", (s) => s.delete(k));

  async function shrinkImage(file, max = 1600) {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * k);
    c.height = Math.round(bmp.height * k);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob"))), "image/jpeg", 0.82));
  }

  function setBgBlob(blob) {
    if (bgObjectUrl) URL.revokeObjectURL(bgObjectUrl);
    bgObjectUrl = blob ? URL.createObjectURL(blob) : "";
  }

  function applyBackground() {
    const src = settings.bg === "file" ? bgObjectUrl : settings.bg === "url" ? settings.bgUrl : "";
    $("#bgLayer").style.backgroundImage = src ? `url(${JSON.stringify(src)})` : "";
    document.documentElement.classList.toggle("has-bg", !!src);
  }

  function applySettings() {
    const r = document.documentElement;
    r.dataset.theme = settings.theme;
    if (curTrack()) requestAnimationFrame(fitInk);
    r.classList.toggle("f-left", !!settings.fl);
    r.classList.toggle("f-center", !!settings.fc);
    r.classList.toggle("f-right", !!settings.fr);
    r.style.setProperty("--ts", settings.ts / 100);
    r.style.setProperty("--hs", settings.hs / 100);
    r.style.setProperty("--dim", settings.dim / 100);
    if (settings.text) r.style.setProperty("--text", settings.text);
    else r.style.removeProperty("--text");
    if (settings.accent) r.style.setProperty("--accent", settings.accent);
    else r.style.removeProperty("--accent");
    applyBackground();
    redrawAllWaves();
  }

  function openSettings() {
    const box = h("div", { class: "modal-box settings" });
    const commit = () => {
      store.set("settings", settings);
      applySettings();
    };

    const range = (label, key, min, max, step, suffix) => {
      const input = h("input", { type: "range", min, max, step, value: settings[key], class: "set-range", "aria-label": label });
      const val = h("b", {}, settings[key] + suffix);
      const paint = () => input.style.setProperty("--p", ((input.value - min) / (max - min)) * 100 + "%");
      paint();
      input.addEventListener("input", () => {
        settings[key] = Number(input.value);
        val.textContent = input.value + suffix;
        paint();
        commit();
      });
      return h("div", { class: "set-row" }, h("div", { class: "set-label" }, h("span", {}, label), val), input);
    };

    const colorRow = (label, key, defaultName, swatches) => {
      const current = () => (settings[key] || cssVar(defaultName, "#888888")).toLowerCase();
      const picker = h("input", { type: "color", value: current(), "aria-label": label });
      picker.addEventListener("input", () => {
        settings[key] = picker.value;
        commit();
      });
      picker.addEventListener("change", draw);
      const items = swatches.map((c, i) =>
        h("button", {
          class: "swatch" + (current() === c ? " on" : ""),
          style: `background:${c}`,
          "aria-label": c,
          title: i === 0 ? "По умолчанию" : c,
          onclick: () => {
            settings[key] = i === 0 ? "" : c;
            commit();
            draw();
          },
        })
      );
      return h("div", { class: "set-row" }, h("div", { class: "set-label" }, h("span", {}, label)), h("div", { class: "colors" }, ...items, picker));
    };

    const checkRow = (label, key, after) => {
      const input = h("input", { type: "checkbox", "aria-label": label });
      input.checked = !!settings[key];
      input.addEventListener("change", () => {
        settings[key] = input.checked;
        commit();
        if (after) after();
      });
      return h("label", { class: "set-check" }, input, h("span", {}, label));
    };

    function draw() {
      const themes = [["dark", "Тёмная"], ["light", "Светлая"], ["sunset", "Закат"], ["promodj", "PromoDJ"], ["lofi", "Lo-Fi"], ["vhs", "VHS"], ["cassette", "Кассета"], ["rome", "Рим"]];
      const fileInput = h("input", {
        type: "file",
        accept: "image/*",
        class: "file-input",
        onchange: async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          try {
            const blob = await shrinkImage(file);
            setBgBlob(blob);
            try {
              await idbSet("bg", blob);
            } catch (err) {
              toast("Фон не сохранится после закрытия страницы");
            }
            settings.bg = "file";
            commit();
            draw();
          } catch (err) {
            toast("Не удалось открыть картинку");
          }
        },
      });
      const urlField = h("input", { class: "field", type: "url", placeholder: "https://… ссылка на картинку", value: settings.bg === "url" ? settings.bgUrl : "", "aria-label": "Ссылка на фон" });

      box.replaceChildren(
        h("h3", { class: "modal-title" }, "Настройки вида"),

        h("div", { class: "set-head" }, "Тема"),
        h(
          "div",
          { class: "set-row seg" },
          ...themes.map(([k, name]) =>
            h("button", {
              class: settings.theme === k ? "on" : "",
              onclick: () => {
                settings.theme = k;
                settings.text = "";
                commit();
                draw();
              },
            }, name)
          )
        ),

        h("div", { class: "set-head" }, "Текст"),
        range("Размер заголовков", "hs", 80, 140, 5, "%"),
        range("Размер текста", "ts", 85, 130, 5, "%"),
        colorRow("Цвет акцента", "accent", "--accent", ["#ff5500", "#2f9bff", "#22c55e", "#a855f7", "#ec4899", "#f5b301"]),
        colorRow("Цвет текста", "text", "--text", [cssVar("--text", "#f2f2f2").toLowerCase(), "#ffffff", "#ffd9b0", "#b8e2ff", "#c8f5d2", "#1c1c21"]),

        h("div", { class: "set-head" }, "Рукописный шрифт"),
        h("div", { class: "set-note" }, "Заменяет обычный шрифт на рукописный в выбранной части сайта."),
        checkRow("Левая панель (разделы)", "fl"),
        checkRow("Центральная панель (список треков)", "fc"),
        checkRow("Правая панель (сейчас играет)", "fr"),

        h("div", { class: "set-head" }, "Пробные эффекты"),
        checkRow("Визуализатор звука (в правой панели)", "vz", () => {
          if (settings.vz && !viz.cors && state.cur) toast("Визуализатор включится со следующего трека");
          vizKick();
        }),

        h("div", { class: "set-head" }, "Фон"),
        h(
          "div",
          { class: "bg-buttons" },
          h("button", { class: "btn ghost", onclick: () => fileInput.click() }, "Загрузить картинку"),
          h("button", {
            class: "btn ghost",
            onclick: () => {
              settings.bg = "none";
              setBgBlob(null);
              commit();
              draw();
              idbDel("bg").catch(() => {});
            },
          }, "Убрать фон"),
          fileInput
        ),
        h(
          "div",
          { class: "set-row set-inline" },
          urlField,
          h("button", {
            class: "btn ghost",
            onclick: () => {
              const v = urlField.value.trim();
              if (v && !/^(https?:\/\/|\.{0,2}\/)/i.test(v)) return toast("Ссылка должна начинаться с https://");
              settings.bgUrl = v;
              settings.bg = v ? "url" : "none";
              commit();
              draw();
            },
          }, "Применить")
        ),
        range("Затемнение фона", "dim", 0, 90, 5, "%"),

        h(
          "div",
          { class: "modal-actions" },
          h("button", {
            class: "btn ghost",
            onclick: () => {
              settings = initialSettings();
              store.remove("settings");
              setBgBlob(null);
              applySettings();
              draw();
              toast("Настройки сброшены");
              idbDel("bg").catch(() => {});
            },
          }, "Сбросить"),
          h("button", { class: "btn", onclick: () => close() }, "Готово")
        )
      );
    }

    draw();
    const close = openModal(box);
  }

  /* ------------------------------------------------------------------ help */
  function helpItem(it) {
    if (typeof it === "string") return h("p", {}, it);
    if (it.list) return h("ul", {}, ...it.list.map((x) => h("li", {}, x)));
    if (it.code) return h("pre", {}, it.code);
    return null;
  }

  function openHelp() {
    const sections = window.HELP || [];
    const box = h(
      "div",
      { class: "modal-box help" },
      h("h3", { class: "modal-title" }, "Справка"),
      ...sections.map((s) => h("section", { class: "help-sec" }, h("h4", {}, s.title), ...(s.body || []).map(helpItem))),
      h("div", { class: "modal-actions" }, h("button", { class: "btn", onclick: () => close() }, "Понятно"))
    );
    const close = openModal(box);
  }

  function initSettings() {
    applySettings();
    if (settings.bg === "file") {
      idbGet("bg")
        .then((blob) => {
          if (blob) setBgBlob(blob);
          else settings.bg = "none";
          applyBackground();
        })
        .catch(() => {
          settings.bg = "none";
          applyBackground();
        });
    }
  }

  /* -------------------------------------------------------------- controls */
  function initControls() {
    document.querySelectorAll("[data-icon]").forEach((el) => el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon)));
    $("#brandIcon").innerHTML =
      '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"><path d="M11.4 22.2C12.4 17.5 12.8 13.5 13 9.4" stroke-width="2.4"/><path d="M13 9.4C9.6 4.2 5.6 4.4 2.8 6.8"/><path d="M13 9.4C9 8.4 5.2 10.2 3.6 14"/><path d="M13 9.4C12.6 5.6 14.4 3.2 17.4 2.2"/><path d="M13 9.4C16.8 5.6 20.4 6 22 9"/><path d="M13 9.4C17.2 9.6 19.8 12 20.6 15.6"/></g><circle cx="12" cy="10.8" r="1.3" fill="currentColor"/><circle cx="14.4" cy="10.9" r="1.3" fill="currentColor"/>';
    $("#brandName").textContent = SITE;
    setPlayingUI();

    const playPause = () => {
      if (state.cur) {
        if (audio.paused) audio.play().catch(onPlayError);
        else audio.pause();
      } else if (state.visible.length) playTrack(state.visible[0], { queue: state.visible.slice() });
    };
    $("#bPlay").addEventListener("click", playPause);
    $("#npPlay").addEventListener("click", playPause);
    $("#bNext").addEventListener("click", () => next(false));
    $("#npNext").addEventListener("click", () => next(false));
    $("#bPrev").addEventListener("click", prev);
    $("#npPrev").addEventListener("click", prev);
    $("#pFav").addEventListener("click", () => state.cur && toggleFav(state.cur));
    $("#npFav").addEventListener("click", () => state.cur && toggleFav(state.cur));
    $("#npAdd").addEventListener("click", () => state.cur && playlistMenu($("#npAdd"), state.cur));
    $("#npShare").addEventListener("click", () => shareMenu($("#npShare")));
    window.addEventListener("hashchange", () => {
      if (!state.byId.size) return;
      openFromHash();
      updateNowPlaying();
    });
    $("#bShuffle").addEventListener("click", () => {
      state.shuffle = !state.shuffle;
      $("#bShuffle").classList.toggle("on", state.shuffle);
    });
    $("#bRepeat").addEventListener("click", () => {
      state.repeat = { off: "all", all: "one", one: "off" }[state.repeat];
      const b = $("#bRepeat");
      b.classList.toggle("on", state.repeat !== "off");
      b.classList.toggle("one", state.repeat === "one");
      b.title = { off: "Повтор выключен", all: "Повторять всё", one: "Повторять трек" }[state.repeat];
    });
    $("#bShuffle").addEventListener("click", syncWm);
    $("#bRepeat").addEventListener("click", syncWm);

    // плеер в стиле старых программ (тема VHS): кнопки, полоса перемотки, громкость
    const click = (id, fn) => $(id).addEventListener("click", fn);
    click("#wmPrev", prev);
    click("#wmNext", () => next(false));
    click("#wmPlay", () => {
      if (!state.cur || audio.paused) playPause();
    });
    click("#wmPause", () => {
      if (state.cur) playPause();
    });
    click("#wmStop", () => {
      if (!state.cur) return;
      audio.pause();
      audio.currentTime = 0;
      updateProgress();
      syncWm();
    });
    click("#wmShuf", () => $("#bShuffle").click());
    click("#wmRep", () => $("#bRepeat").click());
    click("#wmFav", () => state.cur && toggleFav(state.cur));
    click("#wmAdd", () => state.cur && playlistMenu($("#wmAdd"), state.cur));
    click("#wmLink", () => shareMenu($("#wmLink")));

    // дека в теме «Кассета»
    click("#cxPrev", prev);
    click("#cxNext", () => next(false));
    click("#cxPlay", () => {
      if (!state.cur || audio.paused) playPause();
    });
    click("#cxPause", () => {
      if (state.cur) playPause();
    });
    click("#cxStop", () => {
      if (!state.cur) return;
      audio.pause();
      audio.currentTime = 0;
      updateProgress();
      syncWm();
    });
    click("#cxShuf", () => $("#bShuffle").click());
    click("#cxRep", () => $("#bRepeat").click());
    click("#cxFav", () => state.cur && toggleFav(state.cur));
    click("#cxAdd", () => state.cur && playlistMenu($("#cxAdd"), state.cur));
    click("#cxLink", () => shareMenu($("#cxLink")));

    // панель темы «Рим»
    click("#rmPrev", prev);
    click("#rmNext", () => next(false));
    click("#rmPlay", playPause);
    click("#rmFav", () => state.cur && toggleFav(state.cur));
    click("#rmAdd", () => state.cur && playlistMenu($("#rmAdd"), state.cur));
    click("#rmLink", () => shareMenu($("#rmLink")));
    {
      const rb = $("#rmBar");
      const frac = (e) => {
        const r = rb.getBoundingClientRect();
        return clamp01((e.clientX - r.left) / r.width);
      };
      let on = false;
      rb.addEventListener("pointerdown", (e) => {
        if (e.target.closest("u") || !state.cur) return;
        on = true;
        rmDrag = true;
        rb.setPointerCapture(e.pointerId);
        const f = frac(e);
        rmShow(f, f * duration());
      });
      rb.addEventListener("pointermove", (e) => {
        if (!on) return;
        const f = frac(e);
        rmShow(f, f * duration());
      });
      rb.addEventListener("pointerup", (e) => {
        if (!on) return;
        on = false;
        rmDrag = false;
        seekFrac(frac(e));
      });
    }

    // панель темы Lo-Fi
    click("#lfPrev", prev);
    click("#lfNext", () => next(false));
    click("#lfPlay", playPause);
    click("#lfFav", () => state.cur && toggleFav(state.cur));
    click("#lfAdd", () => state.cur && playlistMenu($("#lfAdd"), state.cur));
    click("#lfLink", () => shareMenu($("#lfLink")));

    const dragBar = (el, onMove, onDone) => {
      const frac = (e) => {
        const r = el.getBoundingClientRect();
        return clamp01((e.clientX - r.left) / r.width);
      };
      let on = false;
      el.addEventListener("pointerdown", (e) => {
        on = true;
        el.setPointerCapture(e.pointerId);
        onMove(frac(e));
      });
      el.addEventListener("pointermove", (e) => on && onMove(frac(e)));
      el.addEventListener("pointerup", (e) => {
        if (!on) return;
        on = false;
        onDone(frac(e));
      });
      el.addEventListener("pointercancel", () => {
        on = false;
        onDone(null);
      });
    };
    dragBar(
      $("#wmSeek"),
      (f) => {
        if (!state.cur) return;
        wmDrag = true;
        wmShow(f, f * duration());
      },
      (f) => {
        wmDrag = false;
        if (state.cur && f != null) seekFrac(f);
      }
    );
    dragBar(
      $("#lfTrack"),
      (f) => {
        if (!state.cur) return;
        lfDrag = true;
        lfShow(f, f * duration());
      },
      (f) => {
        lfDrag = false;
        if (state.cur && f != null) seekFrac(f);
      }
    );
    dragBar(
      $("#cxSeek"),
      (f) => {
        if (!state.cur) return;
        cxDrag = true;
        cxShow(f, f * duration());
      },
      (f) => {
        cxDrag = false;
        if (state.cur && f != null) seekFrac(f);
      }
    );
    dragBar(
      $("#cxVol"),
      (f) => {
        $("#vol").value = Math.round(f * 100);
        $("#vol").dispatchEvent(new Event("input"));
      },
      () => {}
    );
    dragBar(
      $("#wmVol"),
      (f) => {
        $("#vol").value = Math.round(f * 100);
        $("#vol").dispatchEvent(new Event("input"));
      },
      () => {}
    );

    $("#bSleep").addEventListener("click", sleepMenu);
    $("#bSettings").addEventListener("click", openSettings);
    $("#bHelp").addEventListener("click", openHelp);

    const fromBar = () => {
      if (!isWide()) openNp();
    };
    $("#pCover").addEventListener("click", fromBar);
    $("#pMeta").addEventListener("click", fromBar);
    $("#npClose").addEventListener("click", closeNp);
    $("#npWave").addEventListener("click", (e) => {
      const r = $("#npCanvas").getBoundingClientRect();
      let frac = clamp01((e.clientX - r.left) / r.width);
      const m = markNear($("#npCanvas"), e.clientX);
      if (m && duration()) frac = clamp01(m.t / duration());
      seekFrac(frac);
    });
    bindWaveTip($("#npWave"), $("#npCanvas"), () => !!state.cur);
    mqWide.addEventListener("change", () => {
      closeNp();
      requestAnimationFrame(redrawAllWaves);
    });

    const seek = $("#seek");
    seek.addEventListener("input", () => {
      dragging = true;
      seek.style.setProperty("--p", seek.value / 10 + "%");
      $("#tCur").textContent = fmt((seek.value / 1000) * duration());
    });
    seek.addEventListener("change", () => {
      if (duration()) audio.currentTime = (seek.value / 1000) * duration();
      dragging = false;
    });

    const vol = $("#vol");
    const applyVolume = () => {
      audio.volume = vol.value / 100;
      vol.style.setProperty("--p", vol.value + "%");
      $("#wmVol").firstElementChild.style.width = vol.value + "%";
      $("#wmVol").lastElementChild.style.left = `calc(${vol.value}% - ${vol.value * 0.08}px)`;
      $("#cxVol").firstElementChild.style.width = vol.value + "%";
      $("#cxVol").lastElementChild.style.left = `calc(${vol.value}% - ${vol.value * 0.16}px)`;
      $("#bMute").innerHTML = icon(audio.muted || audio.volume === 0 ? "mute" : "volume");
    };
    vol.addEventListener("input", () => {
      audio.muted = false;
      applyVolume();
    });
    $("#bMute").addEventListener("click", () => {
      audio.muted = !audio.muted;
      applyVolume();
    });
    applyVolume();

    $("#search").addEventListener("input", (e) => {
      state.query = e.target.value;
      renderContent();
    });

    audio.addEventListener("play", setPlayingUI);
    audio.addEventListener("pause", setPlayingUI);
    audio.addEventListener("playing", () => setLoading(false));
    audio.addEventListener("canplay", () => setLoading(false));
    audio.addEventListener("suspend", () => setLoading(false));
    audio.addEventListener("waiting", () => setLoading(true));
    audio.addEventListener("loadstart", () => setLoading(true));
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("durationchange", updateProgress);
    audio.addEventListener("loadedmetadata", () => {
      if (isFinite(audio.duration)) {
        if (pendingTime > 0) audio.currentTime = Math.min(pendingTime, audio.duration);
        else if (pendingSeek > 0) audio.currentTime = pendingSeek * audio.duration;
      }
      pendingSeek = 0;
      pendingTime = 0;
    });
    audio.addEventListener("ended", () => {
      if (state.sleep && state.sleep.end) {
        state.sleep = null;
        updateSleepUI();
        setPlayingUI();
        toast("Таймер сна: воспроизведение остановлено");
        return;
      }
      next(true);
    });
    audio.addEventListener("durationchange", renderRmSticks);
    audio.addEventListener("play", vizKick);
    audio.addEventListener("error", () => {
      setLoading(false);
      if (audio.crossOrigin && !viz.src && state.cur) {
        // хранилище не разрешило доступ к звуку для визуализатора: выключаем его и пробуем без него
        settings.vz = false;
        store.set("settings", settings);
        audio.crossOrigin = null;
        viz.cors = false;
        pendingTime = Math.floor(audio.currentTime) || 0;
        audio.src = urlOf(state.cur);
        audio.play().catch(onPlayError);
        vizKick();
        toast("Визуализатор не работает с этим хранилищем, он выключен");
        return;
      }
      if (state.cur) toast("Не удалось загрузить трек");
    });

    document.addEventListener("keydown", (e) => {
      if (document.querySelector(".modal-backdrop")) return;
      const tag = (e.target.tagName || "").toLowerCase();
      if (e.key === "Escape") {
        closeMenu();
        closeNp();
        if (tag === "input" && e.target.id === "search" && e.target.value) {
          e.target.value = "";
          state.query = "";
          renderContent();
        }
        return;
      }
      if (tag === "input" && e.target.type !== "range") return;
      if (e.code === "Space" && tag !== "button" && tag !== "a") {
        e.preventDefault();
        $("#bPlay").click();
      } else if (e.key === "ArrowRight" && state.cur && tag !== "input") audio.currentTime += 15;
      else if (e.key === "ArrowLeft" && state.cur && tag !== "input") audio.currentTime -= 15;
    });

    if ("mediaSession" in navigator) {
      const ms = navigator.mediaSession;
      const set = (action, fn) => {
        try {
          ms.setActionHandler(action, fn);
        } catch (e) {
          /* unsupported action */
        }
      };
      set("play", () => audio.play().catch(onPlayError));
      set("pause", () => audio.pause());
      set("previoustrack", prev);
      set("nexttrack", () => next(false));
      set("seekto", (d) => {
        audio.currentTime = d.seekTime;
      });
      set("seekbackward", () => (audio.currentTime -= 15));
      set("seekforward", () => (audio.currentTime += 15));
    }

    let resizeFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(redrawAllWaves);
    };
    new ResizeObserver(onResize).observe($("#content"));
    new ResizeObserver(onResize).observe($("#np"));

    setInterval(updateSleepUI, 15000);
  }

  initControls();
  initSettings();
  load();
})();

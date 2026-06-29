/* ===================================================================
   CLEMENT CHEW v2 — SITE CONFIG
   ▶▶  Same two values as the main site.  ◀◀
   =================================================================== */
const CONFIG = {
  whatsappNumber: "6581331098",   // country code, no "+", no spaces
  ceaRegNo: "R060146F",
};
/* =================================================================== */

(function () {
  "use strict";

  const digits = CONFIG.whatsappNumber.replace(/\D/g, "");
  const isPlaceholder = digits === "6500000000" || digits === "";

  function waLink(message) {
    const base = "https://wa.me/" + digits;
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }

  /* Wire every [data-wa] element */
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.setAttribute("href", waLink(el.getAttribute("data-wa")));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* Direct WhatsApp links + label */
  const defaultMsg = "Hi Clement, I found your website and would like to enquire about property.";
  const waFloat = document.getElementById("waFloat");
  const waDirect = document.getElementById("waDirect");
  if (waFloat) waFloat.setAttribute("href", waLink(defaultMsg));
  if (waDirect) waDirect.setAttribute("href", waLink(defaultMsg));

  const waLabel = document.getElementById("waNumberLabel");
  if (waLabel && !isPlaceholder) {
    waLabel.textContent = (digits.length === 10 && digits.startsWith("65"))
      ? "+65 " + digits.slice(2, 6) + " " + digits.slice(6)
      : "+" + digits;
  }

  /* CEA + year */
  const cea = document.getElementById("ceaNo");
  if (cea) cea.textContent = CONFIG.ceaRegNo;
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* Lead form → WhatsApp */
  const form = document.getElementById("leadForm");
  if (form) {
    const setErr = function (id, msg) {
      const input = document.getElementById(id);
      const errEl = document.querySelector('[data-err-for="' + id + '"]');
      if (errEl) errEl.textContent = msg || "";
      if (input) input.classList.toggle("invalid", !!msg);
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const contact = form.contact.value.trim();
      const intent = form.intent.value;
      const message = form.message.value.trim();

      let ok = true;
      if (!name) { setErr("lf-name", "Please enter your name."); ok = false; } else setErr("lf-name", "");
      if (!contact) { setErr("lf-contact", "Add a phone or email so I can reply."); ok = false; } else setErr("lf-contact", "");
      if (!ok) { const f = form.querySelector(".invalid"); if (f) f.focus(); return; }

      if (isPlaceholder) { alert("Set CONFIG.whatsappNumber in script.js to connect WhatsApp."); return; }

      const lines = [
        "Hi Clement, I'd like a property consultation.", "",
        "Name: " + name, "Contact: " + contact, "Looking to: " + intent,
      ];
      if (message) lines.push("Details: " + message);
      lines.push("", "(Sent from your website)");
      window.open(waLink(lines.join("\n")), "_blank", "noopener");
    });
    ["lf-name", "lf-contact"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", function () { setErr(id, ""); });
    });
  }

  /* Mobile nav */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    const close = function () { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); };
    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
  }

  /* Nav: light over hero, solid after */
  const nav = document.getElementById("nav");
  const hero = document.querySelector(".hero");
  if (nav) {
    const navH = 70;
    const onScroll = function () {
      const threshold = hero ? hero.offsetHeight - navH - 10 : 160;
      if (window.scrollY > threshold) { nav.classList.add("solid"); nav.classList.remove("hero-dark"); }
      else { nav.classList.remove("solid"); nav.classList.add("hero-dark"); }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  /* Listings carousel arrows */
  var carTrack = document.getElementById("carTrack");
  if (carTrack) {
    var step = function (dir) {
      var card = carTrack.querySelector(".listing");
      var w = card ? card.getBoundingClientRect().width + 18 : 300;
      carTrack.scrollBy({ left: dir * w, behavior: "smooth" });
    };
    var carPrev = document.getElementById("carPrev");
    var carNext = document.getElementById("carNext");
    if (carPrev) carPrev.addEventListener("click", function () { step(-1); });
    if (carNext) carNext.addEventListener("click", function () { step(1); });
  }

  /* Flying awards — continuous downward rain (varied sizes, full width) */
  var flySection = document.getElementById("awards");
  if (flySection) {
    var stage = flySection.querySelector(".fly-sticky") || flySection;
    var flyItems = Array.prototype.slice.call(flySection.querySelectorAll(".fly-item"));

    // Load award images only as the section approaches — keeps initial load light on every device.
    var loadFlyImages = function () { flyItems.forEach(function (it) { it.removeAttribute("loading"); }); };
    if ("IntersectionObserver" in window) {
      var flyImgIo = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { loadFlyImages(); flyImgIo.disconnect(); }
      }, { rootMargin: "800px 0px" });
      flyImgIo.observe(flySection);
    } else { loadFlyImages(); }

    var reduceMo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var motionScale = reduceMo ? 0.4 : 1;   // still falls on phones w/ Reduce Motion / battery saver, just gentler
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    var smallScreen = function () { return window.innerWidth <= 600; };
    var H = 0, Wd = 0;
    var measure = function () { H = stage.clientHeight || window.innerHeight; Wd = stage.clientWidth || window.innerWidth; };

    var resetItem = function (it, firstFill) {
      var maxW = smallScreen() ? 110 : 168;
      it._w = rnd(smallScreen() ? 54 : 70, maxW);     // different sizes
      it.style.width = it._w.toFixed(0) + "px";
      it._x = rnd(0.04, 0.96);                         // fraction of width — spans the full panel incl. the middle
      it._rot = rnd(-14, 14);
      it._drot = rnd(-5, 5);                           // slow rotation drift (deg/s)
      it._speed = rnd(42, 96) * motionScale;           // fall speed px/s
      it._sway = rnd(6, 24) * motionScale;             // gentle horizontal sway px
      it._swaySpeed = rnd(0.25, 0.6);
      it._phase = rnd(0, 6.283);
      it._y = firstFill ? rnd(-H * 0.25, H) : -it._w - rnd(0, H * 0.4);
    };

    var place = function (it, t) {
      var x = it._x * Wd + Math.sin(t * it._swaySpeed + it._phase) * it._sway;
      var op = 1, fz = 90;
      if (it._y < fz) op = (it._y + it._w) / (fz + it._w);
      else if (it._y > H - fz) op = (H - it._y) / fz;
      op = Math.max(0, Math.min(1, op));
      it.style.transform = "translate(-50%,0) translate(" + x.toFixed(1) + "px," + it._y.toFixed(1) + "px)";
      it.style.opacity = op;
    };

    measure();
    flyItems.forEach(function (it) { resetItem(it, true); });

    var last = 0, raf = 0, running = false;
    var loop = function (ts) {
      if (!running) return;
      if (!last) last = ts;
      var dt = Math.min(0.05, (ts - last) / 1000); last = ts;
      var t = ts / 1000;
      for (var i = 0; i < flyItems.length; i++) {
        var it = flyItems[i];
        it._y += it._speed * dt;
        if (it._y > H + it._w) resetItem(it, false);   // recycle to the top
        place(it, t);
      }
      raf = requestAnimationFrame(loop);
    };
    var start = function () { if (!running) { running = true; last = 0; raf = requestAnimationFrame(loop); } };
    var stop = function () { running = false; if (raf) cancelAnimationFrame(raf); };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }, { threshold: 0 }).observe(flySection);
    } else { start(); }
    // Resume cleanly after the tab/app is backgrounded on mobile.
    document.addEventListener("visibilitychange", function () { if (!document.hidden && running) { last = 0; } });
    var rT;
    window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(measure, 200); }, { passive: true });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(
    ".split-media, .split-body, .roe .wrap, .section-head, .folio-cell, .step, .contact-intro, .lead-form, .reviews-head, .review, .listings-text, .film-head, .film-player, .spot-head, .spot-safety, .spot-savings"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });
  // Stagger grouped items so they cascade in rather than snapping together.
  [".folio-cell", ".step", ".review"].forEach(function (sel) {
    var group = document.querySelectorAll(sel);
    for (var i = 0; i < group.length; i++) {
      group[i].style.transitionDelay = ((i % 6) * 70) + "ms";
    }
  });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -50px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }
})();

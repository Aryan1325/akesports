/* =========================================================
   AK eSPORTS — site configuration
   Edit this block only. Leave a value "" until you have it;
   buttons will then show a friendly "not configured" message.
   ========================================================= */
const CONFIG = {
  email: "",                    // e.g. "business@yourdomain.com"
  applyUrl: "",                 // e.g. Google Form link
  instagramMain: "",            // AK eSPORTS Instagram
  instagramChakravyuh: "",
  instagramRudrani: "",
  youtube: "",
  discord: ""
};

/* Teams & players. Replace placeholder entries with real data.
   Set placeholder:false on real players. Add `socials` like
   { instagram: "https://...", youtube: "https://..." } */
const TEAMS = [
  {
    id: "chakravyuh",
    name: "Chakravyuh eSports",
    note: "Competitive Division",
    logo: "C",
    players: [
      { ign: "Player IGN 1", role: "Role", game: "Game Title", placeholder: true },
      { ign: "Player IGN 2", role: "Role", game: "Game Title", placeholder: true },
      { ign: "Player IGN 3", role: "Role", game: "Game Title", placeholder: true },
      { ign: "Player IGN 4", role: "Role", game: "Game Title", placeholder: true }
    ]
  },
  {
    id: "rudrani",
    name: "Rudrani eSports",
    note: "Female Division",
    logo: "R",
    players: [
      { ign: "Player IGN 1", role: "Role", game: "Game Title", placeholder: true },
      { ign: "Player IGN 2", role: "Role", game: "Game Title", placeholder: true },
      { ign: "Player IGN 3", role: "Role", game: "Game Title", placeholder: true },
      { ign: "Player IGN 4", role: "Role", game: "Game Title", placeholder: true }
    ]
  }
];

/* Add real entries: { date:"Nov 2026", title:"...", text:"..." } */
const ACHIEVEMENTS = [];

/* News cards. Set placeholder:false when you add real news. */
const NEWS = [
  { tag: "Tournament Announcements", title: "Tournament news will appear here", text: "Placeholder. Replace with a real announcement.", placeholder: true },
  { tag: "Recruitment Updates", title: "Recruitment updates will appear here", text: "Placeholder. Replace with a real update.", placeholder: true },
  { tag: "Team Announcements", title: "Team announcements will appear here", text: "Placeholder. Replace with a real announcement.", placeholder: true },
  { tag: "Organizational News", title: "Organization news will appear here", text: "Placeholder. Replace with real news.", placeholder: true }
];

/* ========================= code ========================= */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Toast */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3800);
  }

  /* Configurable links */
  $$("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    const val = (CONFIG[key] || "").trim();
    if (key === "email" && val) {
      el.href = "mailto:" + val;
      el.textContent = val;
    } else if (key !== "email" && val) {
      el.href = val;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    } else {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        toast("This link isn't set up yet. Add it in the CONFIG block of script.js.");
      });
    }
  });

  /* Nav: sticky style, mobile menu, active link */
  const nav = $("#nav"), toggle = $("#navToggle"), menu = $("#navMenu");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    menu.classList.remove("open");
    nav.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  const sections = $$("main section[id]");
  const links = $$("a", menu);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* Teams */
  const teamsRoot = $("#teamsRoot");
  function socialLinks(s) {
    if (!s) return "";
    const items = Object.entries(s).filter(([, v]) => v);
    if (!items.length) return "";
    return '<div class="player__links">' + items.map(([k, v]) =>
      `<a href="${esc(v)}" target="_blank" rel="noopener noreferrer">${esc(k)}</a>`).join("") + "</div>";
  }
  function renderTeams(filter) {
    const list = TEAMS.filter((t) => filter === "all" || t.id === filter);
    teamsRoot.innerHTML = list.map((t) => `
      <div class="team">
        <div class="team__head">
          <div class="team__logo" aria-label="${esc(t.name)} logo placeholder">${esc(t.logo)}</div>
          <div><h3>${esc(t.name)}</h3><p>${esc(t.note)} · team logo placeholder</p></div>
        </div>
        <div class="players">
          ${t.players.map((p) => `
            <article class="player">
              ${p.placeholder ? '<span class="badge">PLACEHOLDER</span>' : ""}
              <div class="player__avatar" aria-hidden="true">${esc(p.ign.charAt(0).toUpperCase())}</div>
              <h4>${esc(p.ign)}</h4>
              <dl><dt>Role</dt><dd>${esc(p.role)}</dd><dt>Game</dt><dd>${esc(p.game)}</dd></dl>
              ${socialLinks(p.socials)}
            </article>`).join("")}
        </div>
      </div>`).join("");
  }
  function setFilter(f) {
    $$(".tab").forEach((b) => {
      const on = b.dataset.filter === f;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });
    renderTeams(f);
  }
  $$(".tab").forEach((b) => b.addEventListener("click", () => setFilter(b.dataset.filter)));
  $$("[data-division]").forEach((el) => el.addEventListener("click", (e) => {
    e.preventDefault();
    closeMenu();
    setFilter(el.dataset.division);
    $("#teams").scrollIntoView({ behavior: "smooth" });
  }));
  renderTeams("all");

  /* Achievements */
  const achRoot = $("#achievementsRoot");
  if (!ACHIEVEMENTS.length) {
    achRoot.innerHTML = `<div class="empty"><h3>Our journey is just getting started</h3><p>Tournament participation, results and organizational milestones will be showcased here as they happen.</p></div>`;
  } else {
    achRoot.innerHTML = '<ul class="timeline">' + ACHIEVEMENTS.map((a) =>
      `<li><time>${esc(a.date)}</time><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></li>`).join("") + "</ul>";
  }

  /* News */
  $("#newsRoot").innerHTML = NEWS.map((n) => `
    <article class="news reveal">
      ${n.placeholder ? '<span class="badge">PLACEHOLDER</span>' : ""}
      <span class="news__tag">${esc(n.tag)}</span>
      <h3>${esc(n.title)}</h3>
      <p>${esc(n.text)}</p>
    </article>`).join("");

  /* Contact form */
  const form = $("#contactForm"), status = $("#formStatus");
  const rules = {
    name: (v) => (v.trim().length < 2 ? "Please enter your name." : ""),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
    subject: (v) => (v.trim().length < 3 ? "Please enter a subject." : ""),
    message: (v) => (v.trim().length < 10 ? "Message should be at least 10 characters." : "")
  };
  function validate(name) {
    const input = form.elements[name];
    const err = rules[name](input.value);
    $("#" + name + "Err").textContent = err;
    input.closest(".field").classList.toggle("invalid", !!err);
    input.setAttribute("aria-invalid", err ? "true" : "false");
    return !err;
  }
  Object.keys(rules).forEach((n) => form.elements[n].addEventListener("blur", () => validate(n)));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";
    const ok = Object.keys(rules).map(validate).every(Boolean);
    if (!ok) { const bad = $(".invalid input, .invalid textarea", form); if (bad) bad.focus(); return; }
    const to = (CONFIG.email || "").trim();
    if (!to) {
      status.textContent = "Your message looks good, but no business email is configured yet. Set CONFIG.email in script.js to enable sending.";
      return;
    }
    const d = new FormData(form);
    const body = `Name: ${d.get("name")}\nEmail: ${d.get("email")}\n\n${d.get("message")}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(d.get("subject"))}&body=${encodeURIComponent(body)}`;
    status.textContent = "Opening your email app to send the message…";
    form.reset();
  });

  /* Reveal on scroll */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* Footer year */
  $("#year").textContent = new Date().getFullYear();
})();

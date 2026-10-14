// ====== SETTINGS: change these to your own details ======
const BRAND = { whatsapp: "94770000000" }; // your WhatsApp number, country code first, no +

document.addEventListener("DOMContentLoaded", () => {
  // mobile menu
  const burger = document.querySelector(".burger"), menu = document.querySelector(".menu");
  if (burger) burger.addEventListener("click", () => menu.classList.toggle("open"));

  // active link
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach(a => {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });

  // reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // counters
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || "";
    let n = 0; const step = Math.max(1, Math.ceil(end / 80));
    const t = setInterval(() => {
      n = Math.min(end, n + step);
      el.textContent = n.toLocaleString() + suf;
      if (n >= end) clearInterval(t);
    }, 20);
    cio.unobserve(el);
  }), { threshold: .5 });
  document.querySelectorAll("[data-count]").forEach(el => cio.observe(el));

  // testimonials slider
  const slides = document.querySelectorAll(".slide"), dots = document.querySelector(".dots");
  if (slides.length) {
    let i = 0;
    slides.forEach((_, k) => { const d = document.createElement("i"); d.onclick = () => go(k); dots.appendChild(d); });
    const go = k => {
      i = k;
      slides.forEach((s, x) => s.classList.toggle("on", x === i));
      [...dots.children].forEach((d, x) => d.classList.toggle("on", x === i));
    };
    go(0); setInterval(() => go((i + 1) % slides.length), 5500);
  }

  // faq
  document.querySelectorAll(".faq-q").forEach(b =>
    b.addEventListener("click", () => b.parentElement.classList.toggle("open")));

  // price calculator
  const calc = document.getElementById("calc");
  if (calc) {
    const out = document.getElementById("calcTotal");
    const update = () => {
      let sum = 0;
      calc.querySelectorAll("[data-price]").forEach(el => {
        if (el.type === "checkbox") { if (el.checked) sum += +el.dataset.price; }
        else sum += (+el.value || 0) * +el.dataset.price;
      });
      out.textContent = "LKR " + sum.toLocaleString();
      calc.dataset.total = sum;
    };
    calc.addEventListener("input", update); update();
  }

  // video modal (put your mp4 in assets/video/ and set data-video on the button)
  const modal = document.querySelector(".modal");
  document.querySelectorAll("[data-video]").forEach(btn => btn.addEventListener("click", () => {
    const v = modal.querySelector("video"); v.src = btn.dataset.video;
    modal.classList.add("open"); v.play().catch(() => {});
  }));
  if (modal) {
    const close = () => { modal.classList.remove("open"); modal.querySelector("video").pause(); };
    modal.addEventListener("click", e => { if (e.target === modal) close(); });
    modal.querySelector(".modal-x").addEventListener("click", close);
  }

  // forms -> WhatsApp
  document.querySelectorAll("form[data-wa]").forEach(f => f.addEventListener("submit", e => {
    e.preventDefault();
    const d = new FormData(f);
    let msg = "New enquiry%0A";
    d.forEach((v, k) => msg += `${encodeURIComponent(k)}: ${encodeURIComponent(v)}%0A`);
    const c = document.getElementById("calc");
    if (c && f.dataset.wa === "order") msg += `Estimated total: LKR ${c.dataset.total}`;
    window.open(`https://wa.me/${BRAND.whatsapp}?text=${msg}`, "_blank");
  }));
});

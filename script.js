// Add your business WhatsApp number below, including country code, without + or spaces.
// Example for India: const WHATSAPP_NUMBER = "919876543210";
const WHATSAPP_NUMBER = "917249229837";
// Replace this with your real Instagram profile URL before publishing.
const INSTAGRAM_URL = "https://www.instagram.com/";

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuToggle.textContent = open ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

document.querySelectorAll("[data-service]").forEach(link => {
  link.addEventListener("click", () => {
    const service = document.getElementById("service");
    service.value = link.dataset.service;
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const status = document.getElementById("formStatus");
  if (!WHATSAPP_NUMBER) {
    status.textContent = "WhatsApp contact is not configured yet.";
    return;
  }
  const data = new FormData(event.currentTarget);
  const message = [
    "Hello Infotech IT Solutions!",
    "",
    `Name: ${data.get("name")}`,
    `Business: ${data.get("business") || "Not provided"}`,
    `Service: ${data.get("service")}`,
    `Project details: ${data.get("message")}`
  ].join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  status.textContent = "WhatsApp opened with your project message. Please send it to complete your enquiry.";
});


// Lightweight 3D tilt interaction for cards on pointer devices.
const tiltCards = document.querySelectorAll(".service-card, .work-card, .main-card, .about-panel");
tiltCards.forEach(card => {
  card.classList.add("tilt-ready");
  card.addEventListener("pointermove", event => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 760) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const max = card.classList.contains("main-card") ? 5 : 3.5;
    card.style.transform = `perspective(1000px) rotateX(${(0.5-y)*max}deg) rotateY(${(x-0.5)*max}deg) translateY(-2px)`;
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
});

// Reveal sections as they enter the viewport.
if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".service-card, .work-card, .process-step, .about-copy, .contact-form").forEach(el => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".service-card, .work-card, .process-step, .about-copy, .contact-form").forEach(el => { el.classList.add("reveal-item"); revealObserver.observe(el); });
}

// Apply the Instagram destination consistently wherever an Instagram link exists.
document.querySelectorAll('a[aria-label="Instagram"], .social-link').forEach(link => { link.href = INSTAGRAM_URL; });


// Accessible project-preview lightbox for the portfolio showcase.
(() => {
  const modal = document.getElementById("previewModal");
  if (!modal) return;
  const modalImage = document.getElementById("previewImage");
  const title = document.getElementById("previewTitle");
  const closeButtons = modal.querySelectorAll("[data-close-preview]");
  let lastTrigger = null;

  function closePreview() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll("[data-preview]").forEach(button => {
    button.addEventListener("click", () => {
      lastTrigger = button;
      title.textContent = button.dataset.title || "Project concept";
      modalImage.src = button.dataset.preview;
      modalImage.alt = button.querySelector("img")?.alt || title.textContent;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      modal.querySelector(".preview-close").focus();
    });
  });

  closeButtons.forEach(button => button.addEventListener("click", closePreview));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closePreview();
  });
  document.getElementById("previewContact")?.addEventListener("click", closePreview);
})();

const pages = [...document.querySelectorAll("[data-page]")];
const routeLinks = [...document.querySelectorAll("[data-route-link]")];
const navigation = document.querySelector(".primary-navigation");
const menuToggle = document.querySelector(".menu-toggle");
const toast = document.querySelector("#site-toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 4200);
}

function showPage() {
  const requested = window.location.hash.slice(1) || "home";
  const pageId = pages.some((page) => page.dataset.page === requested) ? requested : "home";

  pages.forEach((page) => {
    const active = page.dataset.page === pageId;
    page.hidden = !active;
    page.classList.toggle("is-active", active);
  });

  routeLinks.forEach((link) => {
    if (link.dataset.routeLink === pageId) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  document.title = `${pageId === "home" ? "Home" : pageId.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())} | My Refuge`;
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("menu-open");
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", showPage);
showPage();

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
});

function updateDonationLink() {
  const amount = document.querySelector('input[name="amount"]:checked').value;
  const frequency = document.querySelector('input[name="frequency"]:checked').value;
  document.querySelector("#donation-link").href = `mailto:myrefuge25@gmail.com?subject=${encodeURIComponent(`Donation inquiry - ${frequency} - $${amount}`)}`;
}

document.querySelectorAll('input[name="amount"], input[name="frequency"]').forEach((input) => {
  input.addEventListener("change", updateDonationLink);
});

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const subject = `${form.get("topic")} - ${form.get("firstName")} ${form.get("lastName")}`;
  const body = `${form.get("message")}\n\nReply to: ${form.get("email")}`;
  window.location.href = `mailto:myrefuge25@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showToast("Your email app should open with your message ready to send.");
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Thanks for your interest. Connect Wix Email Marketing to collect subscribers on the live site.");
});

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", () => {
    if (link.hash === window.location.hash) showPage();
  });
});
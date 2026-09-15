const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

// Mobile hamburger menu
menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen);
});

// Close mobile menu after clicking a navigation link
navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// Reveal sections/cards while scrolling
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((element) => revealObserver.observe(element));

// Highlight the current navigation link
const sections = document.querySelectorAll("section[id]");

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(
          `.nav-link[href="#${entry.target.id}"]`
        );
        if (activeLink) activeLink.classList.add("active");
      }
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => activeObserver.observe(section));

// Contact form demo interaction (no backend required)
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent =
    "✓ Thanks! Your message has been prepared successfully.";
  contactForm.reset();
});

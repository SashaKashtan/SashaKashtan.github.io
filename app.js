const body = document.body;

const header = document.querySelector("[data-header]");

const menu = document.querySelector("[data-mobile-menu]");

const menuToggle = document.querySelector("[data-menu-toggle]");

const menuCloseButtons = document.querySelectorAll("[data-menu-close]");

const menuLinks = document.querySelectorAll(
  ".mobile-menu__nav a, .mobile-menu__button",
);

/* =========================
   MOBILE MENU
========================= */

function setMenu(open) {
  if (!menu || !menuToggle) {
    return;
  }

  menu.classList.toggle("is-open", open);

  body.classList.toggle("menu-open", open);

  menuToggle.setAttribute("aria-expanded", String(open));

  menu.setAttribute("aria-hidden", String(!open));

  menuToggle.setAttribute(
    "aria-label",
    open ? "Закрити меню" : "Відкрити меню",
  );
}

/* OPEN */

menuToggle?.addEventListener("click", () => {
  const isOpen = menu.classList.contains("is-open");

  setMenu(!isOpen);
});

/* CLOSE */

menuCloseButtons.forEach((button) => {
  button.addEventListener("click", () => setMenu(false));
});

/* CLOSE AFTER LINK CLICK */

menuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

/* ESC CLOSE */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu?.classList.contains("is-open")) {
    setMenu(false);
  }
});

/* =========================
   HEADER SCROLL
========================= */

function handleScroll() {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
}

handleScroll();

window.addEventListener("scroll", handleScroll, {
  passive: true,
});

/* =========================
   REVEAL ANIMATION
========================= */

const revealElements = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const elements = [...revealElements];

        const index = elements.indexOf(entry.target);

        setTimeout(
          () => {
            entry.target.classList.add("is-visible");
          },

          Math.max(index, 0) * 10,
        );

        observer.unobserve(entry.target);
      });
    },

    {
      threshold: 0.02,
    },
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
} else {
  /* FALLBACK */
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

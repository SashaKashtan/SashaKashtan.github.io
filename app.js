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

          Math.max(index, 0) * 100,
        );

        observer.unobserve(entry.target);
      });
    },

    {
      threshold: 0.12,
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
/* =========================================================
   EXPERTISE FACTS
========================================================= */

const factsWrapper = document.querySelector("[data-facts]");

const facts = document.querySelectorAll(".expertise-fact");

const mobileMedia = window.matchMedia("(max-width: 767px)");

function revealFact(fact) {
  fact.classList.add("is-visible");
}

/* =========================================================
   DESKTOP
   0.5 sec between every item
========================================================= */

function initDesktopFacts() {
  if (!factsWrapper) return;

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        facts.forEach((fact, index) => {
          setTimeout(() => {
            revealFact(fact);
          }, index * 500);
        });

        currentObserver.unobserve(entry.target);
      });
    },

    {
      threshold: 0.25,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  observer.observe(factsWrapper);
}

/* =========================================================
   MOBILE
   Every fact reveals separately while scrolling
========================================================= */

function initMobileFacts() {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        revealFact(entry.target);

        currentObserver.unobserve(entry.target);
      });
    },

    {
      threshold: 0.48,
      rootMargin: "0px 0px -4% 0px",
    },
  );

  facts.forEach((fact) => {
    observer.observe(fact);
  });
}

/* =========================================================
   INIT
========================================================= */

if (mobileMedia.matches) {
  initMobileFacts();
} else {
  initDesktopFacts();
}

/* =========================================================
   LARGE TITLE REVEAL
========================================================= */

const title = document.querySelector(".expertise-title");

const titleLines = document.querySelectorAll("[data-title-line]");

if (title) {
  const titleObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        titleLines.forEach((line, index) => {
          setTimeout(() => {
            line.classList.add("is-visible");
          }, index * 180);
        });

        observer.unobserve(entry.target);
      });
    },

    {
      threshold: 0.35,
    },
  );

  titleObserver.observe(title);
}

/* =========================================================
   WORK WITH — TOPICS
========================================================= */

const workTopicsWrap = document.querySelector("[data-work-topics]");

const workTopics = document.querySelectorAll(".work-topic");

const workMobile = window.matchMedia("(max-width: 820px)");

/* DESKTOP — stagger */

if (workTopicsWrap && !workMobile.matches) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        workTopics.forEach((topic, index) => {
          setTimeout(() => {
            topic.classList.add("is-visible");
          }, index * 110);
        });

        currentObserver.unobserve(entry.target);
      });
    },

    {
      threshold: 0.2,

      rootMargin: "0px 0px -6% 0px",
    },
  );

  observer.observe(workTopicsWrap);
}

/* MOBILE — each item on scroll */

if (workMobile.matches) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");

        currentObserver.unobserve(entry.target);
      });
    },

    {
      threshold: 0.7,

      rootMargin: "0px 0px -4% 0px",
    },
  );

  workTopics.forEach((topic) => {
    observer.observe(topic);
  });
}

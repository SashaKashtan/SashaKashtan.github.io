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

/* =========================================================
   CERTIFICATES CAROUSEL
========================================================= */

const certificatesSlider = document.querySelector("[data-certificates-slider]");

if (certificatesSlider) {
  const slides = [
    ...certificatesSlider.querySelectorAll("[data-certificate-slide]"),
  ];

  const prevButton = certificatesSlider.querySelector(
    "[data-certificate-prev]",
  );

  const nextButton = certificatesSlider.querySelector(
    "[data-certificate-next]",
  );

  const counter = certificatesSlider.querySelector(
    "[data-certificate-current]",
  );

  const viewport = certificatesSlider.querySelector(
    "[data-certificates-viewport]",
  );

  /*
    Start with certificate 2 in center,
    so immediately there is one left
    and one right.
  */

  let activeIndex = 1;

  function normalizeIndex(index) {
    const total = slides.length;

    return ((index % total) + total) % total;
  }

  function relativePosition(index, active) {
    const total = slides.length;

    let difference = index - active;

    /*
      shortest loop direction
    */

    if (difference > total / 2) {
      difference -= total;
    }

    if (difference < -total / 2) {
      difference += total;
    }

    return difference;
  }

  function renderCertificates() {
    slides.forEach((slide, index) => {
      slide.classList.remove(
        "is-active",
        "is-prev",
        "is-next",
        "is-hidden-left",
        "is-hidden-right",
      );

      const position = relativePosition(index, activeIndex);

      if (position === 0) {
        slide.classList.add("is-active");

        slide.setAttribute("aria-hidden", "false");
      } else if (position === -1) {
        slide.classList.add("is-prev");

        slide.setAttribute("aria-hidden", "false");
      } else if (position === 1) {
        slide.classList.add("is-next");

        slide.setAttribute("aria-hidden", "false");
      } else if (position < 0) {
        slide.classList.add("is-hidden-left");

        slide.setAttribute("aria-hidden", "true");
      } else {
        slide.classList.add("is-hidden-right");

        slide.setAttribute("aria-hidden", "true");
      }
    });

    if (counter) {
      counter.textContent = String(activeIndex + 1).padStart(2, "0");
    }
  }

  function nextCertificate() {
    activeIndex = normalizeIndex(activeIndex + 1);

    renderCertificates();
  }

  function prevCertificate() {
    activeIndex = normalizeIndex(activeIndex - 1);

    renderCertificates();
  }

  nextButton?.addEventListener("click", nextCertificate);

  prevButton?.addEventListener("click", prevCertificate);

  /*
    Clicking neighbour brings it to center
  */

  slides.forEach((slide, index) => {
    slide.addEventListener("click", () => {
      if (slide.classList.contains("is-prev")) {
        prevCertificate();
      } else if (slide.classList.contains("is-next")) {
        nextCertificate();
      }
    });
  });

  /* =======================================================
     SWIPE / DRAG
  ======================================================= */

  let pointerStartX = 0;
  let pointerEndX = 0;
  let pointerActive = false;

  viewport?.addEventListener("pointerdown", (event) => {
    pointerActive = true;

    pointerStartX = event.clientX;

    pointerEndX = event.clientX;

    viewport.setPointerCapture?.(event.pointerId);
  });

  viewport?.addEventListener("pointermove", (event) => {
    if (!pointerActive) {
      return;
    }

    pointerEndX = event.clientX;
  });

  function finishSwipe() {
    if (!pointerActive) {
      return;
    }

    pointerActive = false;

    const distance = pointerEndX - pointerStartX;

    /*
      Avoid accidental switching
    */

    if (Math.abs(distance) < 45) {
      return;
    }

    if (distance < 0) {
      nextCertificate();
    } else {
      prevCertificate();
    }
  }

  viewport?.addEventListener("pointerup", finishSwipe);

  viewport?.addEventListener("pointercancel", finishSwipe);

  /* =======================================================
     KEYBOARD
  ======================================================= */

  certificatesSlider.setAttribute("tabindex", "0");

  certificatesSlider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      nextCertificate();
    }

    if (event.key === "ArrowLeft") {
      prevCertificate();
    }
  });

  /* INITIAL */

  renderCertificates();
}
/* =========================================================
   REVIEWS / IPHONE CAROUSEL
========================================================= */

const reviewsSlider = document.querySelector("[data-reviews-slider]");

if (reviewsSlider) {
  const reviews = [...reviewsSlider.querySelectorAll("[data-review-slide]")];

  const viewport = reviewsSlider.querySelector("[data-reviews-viewport]");

  const prevButton = reviewsSlider.querySelector("[data-review-prev]");

  const nextButton = reviewsSlider.querySelector("[data-review-next]");

  const currentCounter = reviewsSlider.querySelector("[data-review-current]");

  /*
    Start with second review in middle,
    so left and right phones are visible.
  */

  let currentReview = 1;

  function normalizeReview(index) {
    const total = reviews.length;

    return ((index % total) + total) % total;
  }

  function getReviewPosition(index, active) {
    const total = reviews.length;

    let difference = index - active;

    if (difference > total / 2) {
      difference -= total;
    }

    if (difference < -total / 2) {
      difference += total;
    }

    return difference;
  }

  function renderReviews() {
    reviews.forEach((review, index) => {
      review.classList.remove(
        "is-active",
        "is-prev",
        "is-next",
        "is-hidden-left",
        "is-hidden-right",
      );

      const position = getReviewPosition(index, currentReview);

      if (position === 0) {
        review.classList.add("is-active");

        review.setAttribute("aria-hidden", "false");
      } else if (position === -1) {
        review.classList.add("is-prev");

        review.setAttribute("aria-hidden", "false");
      } else if (position === 1) {
        review.classList.add("is-next");

        review.setAttribute("aria-hidden", "false");
      } else if (position < 0) {
        review.classList.add("is-hidden-left");

        review.setAttribute("aria-hidden", "true");
      } else {
        review.classList.add("is-hidden-right");

        review.setAttribute("aria-hidden", "true");
      }
    });

    if (currentCounter) {
      currentCounter.textContent = String(currentReview + 1).padStart(2, "0");
    }
  }

  function nextReview() {
    currentReview = normalizeReview(currentReview + 1);

    renderReviews();
  }

  function prevReview() {
    currentReview = normalizeReview(currentReview - 1);

    renderReviews();
  }

  nextButton?.addEventListener("click", nextReview);

  prevButton?.addEventListener("click", prevReview);

  /* CLICK SIDE PHONE */

  reviews.forEach((review) => {
    review.addEventListener("click", () => {
      if (review.classList.contains("is-prev")) {
        prevReview();
      }

      if (review.classList.contains("is-next")) {
        nextReview();
      }
    });
  });

  /* =======================================================
     SWIPE
  ======================================================= */

  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  viewport?.addEventListener("pointerdown", (event) => {
    isDragging = true;

    startX = event.clientX;

    currentX = event.clientX;

    viewport.setPointerCapture?.(event.pointerId);
  });

  viewport?.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }

    currentX = event.clientX;
  });

  function finishReviewSwipe() {
    if (!isDragging) {
      return;
    }

    isDragging = false;

    const distance = currentX - startX;

    if (Math.abs(distance) < 45) {
      return;
    }

    if (distance < 0) {
      nextReview();
    } else {
      prevReview();
    }
  }

  viewport?.addEventListener("pointerup", finishReviewSwipe);

  viewport?.addEventListener("pointercancel", finishReviewSwipe);

  /* KEYBOARD */

  reviewsSlider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      nextReview();
    }

    if (event.key === "ArrowLeft") {
      prevReview();
    }
  });

  renderReviews();
}

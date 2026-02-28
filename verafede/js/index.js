/* Automatically Matches the System Theme */
const html = document.documentElement;
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme() {
  html.setAttribute("data-theme", systemPrefersDark.matches ? "dark" : "light");
}

applyTheme();
systemPrefersDark.addEventListener("change", applyTheme);

const themeToggle = document.getElementById("themeToggle");

// Detect system theme on load
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  html.setAttribute("data-theme", "dark");
}

// Toggle theme manually
themeToggle.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");

  if (currentTheme === "dark") {
    html.setAttribute("data-theme", "light");
  } else {
    html.setAttribute("data-theme", "dark");
  }
});

/* Mobile Toggle Navigation */
const toggle = document.getElementById("mobileToggle");
const navList = document.querySelector(".nav-list");

toggle.addEventListener("click", () => {
  navList.classList.toggle("active");
});

/* Slider Functionality */
document.querySelectorAll(".slider").forEach((slider) => {
  const slides = slider.querySelector(".slides");
  const slide = slider.querySelectorAll(".slide");
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
  const dotsContainer = slider.querySelector(".slider-dots");

  let index = 0;
  const totalSlides = slide.length;

  slide.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      index = i;
      updateSlider();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("span");

  function updateSlider() {
    slides.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[index].classList.add("active");
  }

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % totalSlides;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + totalSlides) % totalSlides;
    updateSlider();
  });

  setInterval(() => {
    index = (index + 1) % totalSlides;
    updateSlider();
  }, 5000);
});

const categoryButtons = document.querySelectorAll(".category-btn");
const workCards = document.querySelectorAll(".work-card");

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // active button style
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.getAttribute("data-category");

    workCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");

      if (category === "all" || category === cardCategory) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

const worksSliderContainer = document.querySelector(".works-slider");
const worksTrack = document.querySelector(".works-track");
const worksCategoryBtns = document.querySelectorAll(".category-btn");

let worksScrollSpeed = 0.5;
let worksPosition = 0;
let worksAnimationFrame = null;

// Store original cards safely
const worksOriginalCards = Array.from(
  worksTrack.querySelectorAll(".work-card")
);

function worksStartAutoScroll() {
  if (worksAnimationFrame) return;

  function worksAnimate() {
    worksPosition -= worksScrollSpeed;
    worksTrack.style.transform = `translateX(${worksPosition}px)`;

    if (Math.abs(worksPosition) >= worksTrack.scrollWidth / 2) {
      worksPosition = 0;
    }

    worksAnimationFrame = requestAnimationFrame(worksAnimate);
  }

  worksAnimate();
}

function worksStopAutoScroll() {
  cancelAnimationFrame(worksAnimationFrame);
  worksAnimationFrame = null;
  worksPosition = 0;
  worksTrack.style.transform = "translateX(0)";
}

function worksRebuildSlider(filteredCards) {
  worksStopAutoScroll();

  worksTrack.innerHTML = "";

  // Add filtered cards
  filteredCards.forEach((card) => {
    worksTrack.appendChild(card.cloneNode(true));
  });

  // Enable infinite only if 3+ cards
  if (filteredCards.length >= 3) {
    filteredCards.forEach((card) => {
      worksTrack.appendChild(card.cloneNode(true));
    });

    worksStartAutoScroll();
  }
}

worksCategoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    worksCategoryBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const selectedCategory = btn.dataset.category;

    const filteredCards = worksOriginalCards.filter((card) => {
      return (
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory
      );
    });

    worksRebuildSlider(filteredCards);
  });
});

worksRebuildSlider(worksOriginalCards);

worksSliderContainer.addEventListener("mouseenter", () => {
  worksStopAutoScroll();
});

worksSliderContainer.addEventListener("mouseleave", () => {
  const activeBtn = document.querySelector(".category-btn.active");
  const selectedCategory = activeBtn.dataset.category;

  const filteredCards = worksOriginalCards.filter((card) => {
    return (
      selectedCategory === "all" ||
      card.dataset.category === selectedCategory
    );
  });

  if (filteredCards.length >= 3) {
    worksStartAutoScroll();
  }
});
/* ===============================
   THEME TOGGLE
================================= */
const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  html.setAttribute("data-theme", savedTheme);
} else {
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  html.setAttribute("data-theme", systemPrefersDark.matches ? "dark" : "light");
}

// Toggle theme safely
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

/* ===============================
   MOBILE NAVIGATION
================================= */
const toggle = document.getElementById("mobileToggle");
const navList = document.querySelector(".nav-list");

if (toggle && navList) {
  toggle.addEventListener("click", () => {
    navList.classList.toggle("active");
  });
}

/* ===============================
   BASIC SLIDER (If Exists)
================================= */
const sliders = document.querySelectorAll(".slider");

if (sliders.length > 0) {
  sliders.forEach((slider) => {
    const slides = slider.querySelector(".slides");
    const slide = slider.querySelectorAll(".slide");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");
    const dotsContainer = slider.querySelector(".slider-dots");

    if (!slides || !prevBtn || !nextBtn || !dotsContainer) return;

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
}

/* ===============================
   CATEGORY FILTER (Projects Page)
================================= */
const categoryButtons = document.querySelectorAll(".category-btn");
const workCards = document.querySelectorAll(".work-card");

if (categoryButtons.length > 0 && workCards.length > 0) {
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
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
}

/* ===============================
   WORKS AUTO SLIDER (Home Page)
================================= */
const worksSliderContainer = document.querySelector(".works-slider");
const worksTrack = document.querySelector(".works-track");

if (worksSliderContainer && worksTrack) {
  const worksCategoryBtns = document.querySelectorAll(".category-btn");

  let worksScrollSpeed = 0.5;
  let worksPosition = 0;
  let worksAnimationFrame = null;

  const worksOriginalCards = Array.from(
    worksTrack.querySelectorAll(".work-card"),
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

    filteredCards.forEach((card) => {
      worksTrack.appendChild(card.cloneNode(true));
    });

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

  worksSliderContainer.addEventListener("mouseenter", worksStopAutoScroll);
  worksSliderContainer.addEventListener("mouseleave", () => {
    const activeBtn = document.querySelector(".category-btn.active");
    const selectedCategory = activeBtn ? activeBtn.dataset.category : "all";

    const filteredCards = worksOriginalCards.filter((card) => {
      return (
        selectedCategory === "all" || card.dataset.category === selectedCategory
      );
    });

    if (filteredCards.length >= 3) {
      worksStartAutoScroll();
    }
  });
}

/* ===============================
   CAREER MODAL (Career Page)
================================= */
const modal = document.getElementById("careerModal");

if (modal) {
  const overlay = document.getElementById("careerOverlay");
  const closeBtn = document.getElementById("careerClose");

  const modalTitle = document.getElementById("modalTitle");
  const modalIntro = document.getElementById("modalIntro");
  const modalDesc = document.getElementById("modalDescription");
  const modalQual = document.getElementById("modalQualifications");

  document.querySelectorAll(".learn-more").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      modalTitle.textContent = this.dataset.title;
      modalIntro.textContent = this.dataset.intro;
      modalDesc.textContent = this.dataset.description;
      modalQual.textContent = this.dataset.qualifications;

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  if (overlay) overlay.addEventListener("click", closeModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
}
/* ===============================
   LET'S TALK MODAL
================================= */
const talkModal = document.getElementById("talkModal");

if (talkModal) {
  const openTalk = document.getElementById("openTalk");
  const talkOverlay = document.getElementById("talkOverlay");
  const talkClose = document.getElementById("talkClose");

  function openTalkModal(e) {
    e.preventDefault();
    talkModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeTalkModal() {
    talkModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  if (openTalk) openTalk.addEventListener("click", openTalkModal);
  if (talkOverlay) talkOverlay.addEventListener("click", closeTalkModal);
  if (talkClose) talkClose.addEventListener("click", closeTalkModal);
}

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
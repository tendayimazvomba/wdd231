const navButton = document.querySelector("nav-button");
const nav = document.querySelector("nav")

navButton.addEventListener("click", () => {
    nav.classList.toggle("open");
    navButton.classList.toggle("open");
})
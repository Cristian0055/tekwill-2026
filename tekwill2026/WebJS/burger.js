/* checks to see if hamburger menu is shown */
const hamburger = document.querySelector(".hamburger");
const linksContainer = document.querySelector(".navList");
const links = document.querySelectorAll(".link");

hamburger.addEventListener("click", () => {
    linksContainer.classList.toggle("active");
    hamburger.classList.toggle("active");
});

window.addEventListener("resize", () => {
    if (window.matchMedia("(max-width: 550px)").matches) {
        closeMenu();
    }
});

if (window.matchMedia("(max-width: 550px)").matches) {
    closeMenu()
};

function closeMenu() {
    links.forEach((links) => {
        links.addEventListener("click", () => {
            linksContainer.classList.remove("active");
            hamburger.classList.remove("active");
        });
    });
}
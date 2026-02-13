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


// The left right button things for the catalog section
for (let i = 1; i <= 2; i++) {      // "i <= 2" shows how many sections there are
    const scrollLeft = document.getElementById(`scrollLeft${i}`);
    const scrollRight = document.getElementById(`scrollRight${i}`);
    const itemWrapper = document.getElementById(`itemWrapper${i}`);

    if (scrollLeft && scrollRight && itemWrapper && window.matchMedia("(max-width: 550px)").matches) { // for small screens
        scrollLeft.addEventListener('click', function() {
            itemWrapper.scrollBy({
                left: -125,
                behavior: 'smooth'
            });
        });

        scrollRight.addEventListener('click', function() {
            itemWrapper.scrollBy({
                left: 125,
                behavior: 'smooth'
            });
        });
    }

    else {  // for the rest of the screens
        scrollLeft.addEventListener('click', function() {
            itemWrapper.scrollBy({
                left: -750,
                behavior: 'smooth'
            });
        });

        scrollRight.addEventListener('click', function() {
            itemWrapper.scrollBy({
                left: 750,
                behavior: 'smooth'
            });
        });
    }
}
// checks to see if hamburger menu is shown
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
    closeMenu();
}

function closeMenu() {
    links.forEach((link) => {
        link.addEventListener("click", () => {
            linksContainer.classList.remove("active");
            hamburger.classList.remove("active");
        });
    });
}


const language = document.querySelectorAll(".language")

language.forEach((lang) => {
    lang.addEventListener("click", (event) => {
        if (event.target.href) {
            event.preventDefault();
        }
        
        if (!document.startViewTransition) {
            setActiveItem(event.target);
            if (event.target.href) {
                    window.location.href = event.target.href;
            }
            return;
        };

        const transition = document.startViewTransition(() => 
            setActiveItem(event.target));
        
        if (event.target.href) {
            transition.finished.then(() => {
                window.location.href = event.target.href;
            });
        }
    });
});

function setActiveItem(element) {
    language.forEach((lang) => lang.classList.remove("active"));
    element.classList.add("active");
}

function setInitialActive() {
    const path = window.location.pathname;
    let activeId;
    if (path.includes('-en')) {
        activeId = 'english';
    } else if (path.includes('-ru')) {
        activeId = 'russian';
    } else {
        activeId = 'romanian';
    }
    const langElement = document.getElementById(activeId);
    if (langElement) {
        setActiveItem(langElement);
    }
}

setInitialActive();
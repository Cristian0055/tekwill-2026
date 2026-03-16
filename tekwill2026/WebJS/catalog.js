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

// The left right button things for the catalog section
for (let i = 1; i <= 3; i++) {
    const scrollLeft = document.getElementById(`scrollLeft${i}`);
    const scrollRight = document.getElementById(`scrollRight${i}`);
    const itemWrapper = document.getElementById(`itemWrapper${i}`);

    if (!scrollLeft || !scrollRight || !itemWrapper) continue;

    const isMobile = window.matchMedia("(max-width: 550px)").matches;
    const scrollDistance = isMobile ? 250 : 1500;

    const items = Array.from(itemWrapper.querySelectorAll(".itemContainer"));
    items.forEach(item => {
        itemWrapper.appendChild(item.cloneNode(true));
    });

    let autoScrollInterval;
    let resumeScrollTimeout;

    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            itemWrapper.scrollBy({ left: scrollDistance, behavior: 'smooth' });
        }, 4000);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
        clearTimeout(resumeScrollTimeout);
    }

    function scheduleResumeAutoScroll() {
        clearTimeout(resumeScrollTimeout);
        resumeScrollTimeout = setTimeout(() => {
            startAutoScroll();
        }, 7500);
    }

    startAutoScroll();

    scrollLeft.addEventListener('click', () => {
        itemWrapper.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
        stopAutoScroll();
        scheduleResumeAutoScroll();
    });

    scrollRight.addEventListener('click', () => {
        itemWrapper.scrollBy({ left: scrollDistance, behavior: 'smooth' });
        stopAutoScroll();
        scheduleResumeAutoScroll();
    });

    itemWrapper.addEventListener('click', () => {
        stopAutoScroll();
        scheduleResumeAutoScroll();
    });

    itemWrapper.addEventListener('scroll', () => {
        const maxScroll = itemWrapper.scrollWidth - itemWrapper.clientWidth;
        if (itemWrapper.scrollLeft >= maxScroll - 50) {
            setTimeout(() => {
                itemWrapper.scrollLeft = 0;
            }, 100);
        }
    });

    itemWrapper.addEventListener('mousedown', () => {
        stopAutoScroll();
    });

    itemWrapper.addEventListener('mouseup', () => {
        scheduleResumeAutoScroll();
    });
}

// Shows the big image when image is clicked
let currentZoom = 1;
document.querySelectorAll('.itemImage').forEach(img => {
    img.addEventListener('click', function() {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('imageInspect');

        modalImg.src = this.src;
        modal.classList.add('active');
        currentZoom = 1;
        modalImg.style.transform = `scale(${currentZoom})`;
        modalImg.classList.remove('zoomed');
        document.body.style.overflow = 'hidden';
    });
});

const modalImg = document.getElementById('imageInspect');
const imageModal = document.getElementById('imageModal');
const isMobileDevice = window.matchMedia("(max-width: 550px)").matches;

function closeImageModal() {
    imageModal.classList.remove('active');
    currentZoom = 1;
    modalImg.style.transform = `scale(${currentZoom})`;
    document.body.style.overflow = 'auto';
}

imageModal.addEventListener('click', function(event) {
    if (event.target === this) {
        closeImageModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeImageModal();
    }
});


// Cart functionality
const cart = document.querySelector(".cart");
const cartScreen = document.querySelector(".cartScreen");
let cartContent = document.querySelector(".cartContent");

if (!cartContent) {
    cartContent = document.createElement("div");
    cartContent.classList.add("cartContent");
    cartScreen.appendChild(cartContent);
}

cartScreen.classList.remove("active");
cart.classList.add("closed");

cart.addEventListener("click", () => {
    cartScreen.classList.toggle("active");
    cart.classList.toggle("closed");
});

const addToCart = (itemContainer) => {
    const itemImage = itemContainer.querySelector(".itemImage").src;
    const itemName = itemContainer.querySelector(".name").textContent;
    const itemPrice = itemContainer.querySelector(".price").textContent;

    const cartItems = cartContent.querySelectorAll(".cartItemName");
    for (let cartItemName of cartItems) {
        if (cartItemName.textContent === itemName) {
            alert("Acest produs este deja în coș.");
            return;
        };
    }
    const cartItem = document.createElement("div");
    cartItem.classList.add("cartItem");
    cartItem.innerHTML = `
        <img src="${itemImage}" class="cartItemImage">
        <div class="cartDetails">
            <p class="cartItemName">${itemName}</p>
            <p class="cartItemPrice">${itemPrice}</p>
            <div class="cartQuantity">
                <button class="decrement">-</button>
                <span class="amount">1</span>
                <button class="increment">+</button>
            </div>
        </div>
        <button class="removeButton"><img src="../../Images/delete.svg" alt="Remove"></button>
        `;

    cartContent.appendChild(cartItem);
    updateTotalPrice();

    cartItem.querySelector(".removeButton").addEventListener("click", () => {
        cartItem.remove();
        updateTotalPrice();
    });

    const decrementButton = cartItem.querySelector(".decrement");
    const incrementButton = cartItem.querySelector(".increment");
    const amountElement = cartItem.querySelector(".amount");

    decrementButton.addEventListener("click", () => {
        let quantity = amountElement.textContent;
        if (quantity > 1) {
            quantity--;
            amountElement.textContent = quantity;
            if (quantity === 1) {
                decrementButton.style.color = "#999";
            }

            updateTotalPrice();
        }

        updateTotalPrice();
    });

    incrementButton.addEventListener("click", () => {
        let quantity = amountElement.textContent;
        quantity++;
        amountElement.textContent = quantity;
        decrementButton.style.color = "#333";
        updateTotalPrice();
    });

    decrementButton.style.color = "#999";
}

const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach(button => {
    button.addEventListener("click", event => {
        const itemContainer = event.target.closest(".itemContainer");
        addToCart(itemContainer);
    });
});

const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector(".totalPrice");
    const cartItems = cartContent.querySelectorAll(".cartItem");
    let total = 0;
    cartItems.forEach(cartItem => {
        const priceElement = cartItem.querySelector(".cartItemPrice");
        const quantityElement = cartItem.querySelector(".amount");
        const price = priceElement.textContent.replace("MDL", "");
        const quantity = quantityElement.textContent;
        total += price * quantity;
    });
    totalPriceElement.textContent = `${total} MDL`;
}

let cartItemCount = 0;
const updateCartCount = change => {
    cartItemCount += change;
}


const cartBuyButton = document.querySelector(".buyButton");
cartBuyButton.addEventListener("click", () => {
    const  cartItems = cartContent.querySelectorAll(".cartItem");
    if (cartItems.length === 0) {
        alert("Coșul este gol!");
        return;
    }

    cartItems.forEach(cartItem => { cartItem.remove() });
    
    cartItemCount = 0;
    updateCartCount(0);
    
    updateTotalPrice();
    
    alert("Mulțumim pentru cumpărături!");
});
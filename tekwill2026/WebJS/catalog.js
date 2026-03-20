// The nav part
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

const CART_STORAGE_KEY = "soulMarketCart";

const saveCartToStorage = () => {
    const cartItems = [];
    cartContent.querySelectorAll('.cartItem').forEach(item => {
        const name = item.querySelector('.cartItemName').textContent;
        const price = item.querySelector('.cartItemPrice').textContent;
        const quantity = item.querySelector('.amount').textContent;
        const image = item.querySelector('.cartItemImage').src;
        cartItems.push({ name, price, quantity, image });
    });
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
};

const loadCartFromStorage = () => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return;

    const items = JSON.parse(stored);
    items.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cartItem");
        cartItem.innerHTML = `
            <img src="${item.image}" class="cartItemImage">
            <div class="cartDetails">
                <p class="cartItemName">${item.name}</p>
                <p class="cartItemPrice">${item.price}</p>
                <div class="cartQuantity">
                    <button class="decrement">-</button>
                    <span class="amount">${item.quantity}</span>
                    <button class="increment">+</button>
                </div>
            </div>
            <button class="removeButton"><img src="../Images/delete.svg" alt="Remove"></button>
        `;

        cartContent.appendChild(cartItem);
        attachCartItemListeners(cartItem);
    });

    updateTotalPrice();
};

const attachCartItemListeners = (cartItem) => {
    const removeButton = cartItem.querySelector(".removeButton");
    const decrementButton = cartItem.querySelector(".decrement");
    const incrementButton = cartItem.querySelector(".increment");
    const amountElement = cartItem.querySelector(".amount");

    removeButton.addEventListener("click", () => {
        cartItem.remove();
        updateTotalPrice();
        saveCartToStorage();
    });

    decrementButton.addEventListener("click", () => {
        let quantity = parseInt(amountElement.textContent);
        if (quantity > 1) {
            quantity--;
            amountElement.textContent = quantity;
            if (quantity === 1) decrementButton.style.color = "#999";
            updateTotalPrice();
            saveCartToStorage();
        }
    });

    incrementButton.addEventListener("click", () => {
        let quantity = parseInt(amountElement.textContent);
        quantity++;
        amountElement.textContent = quantity;
        decrementButton.style.color = "#333";
        updateTotalPrice();
        saveCartToStorage();
    });

    if (parseInt(amountElement.textContent) === 1) {
        decrementButton.style.color = "#999";
    }
};

const addToCart = (itemContainer) => {
    const itemImage = itemContainer.querySelector(".itemImage").src;
    const itemName = itemContainer.querySelector(".name").textContent;
    const itemPrice = itemContainer.querySelector(".price").textContent;

    const existingItem = Array.from(cartContent.querySelectorAll('.cartItem')).find(cartItem => {
        const name = cartItem.querySelector('.cartItemName').textContent;
        return name === itemName;
    });

    if (existingItem) {
        const amountElement = existingItem.querySelector('.amount');
        let quantity = parseInt(amountElement.textContent);
        quantity++;
        amountElement.textContent = quantity;
        updateTotalPrice();
        saveCartToStorage();
        return;
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
        <button class="removeButton"><img src="../Images/delete.svg" alt="Remove"></button>
    `;

    cartContent.appendChild(cartItem);
    attachCartItemListeners(cartItem);
    updateTotalPrice();
    saveCartToStorage();
};

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
        const price = parseFloat(priceElement.textContent.replace("MDL", "")) || 0;
        const quantity = parseInt(quantityElement.textContent) || 0;
        total += price * quantity;
    });
    totalPriceElement.textContent = `${total} MDL`;
};

loadCartFromStorage();

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
    saveCartToStorage();
    
    alert("Mulțumim pentru cumpărături!");
});
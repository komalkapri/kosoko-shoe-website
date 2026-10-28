// Get all the elements we need
const shoeCards = document.querySelectorAll(".shoe-card");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.querySelector("#shoe-search");

// Remember favourite shoes, even after refreshing the page
let favourites = JSON.parse(localStorage.getItem("kosoko-favourites")) || [];

// Currently selected category
let activeFilter = "all";

// Set up each favourite button
shoeCards.forEach((card) => {
    const shoeName = card.querySelector("h3").innerText
        .replace(/\s+/g, " ")
        .trim();

    const favouriteButton = card.querySelector(".favourite-btn");

    if (!favouriteButton) return;

    // Restore saved favourite status
    if (favourites.includes(shoeName)) {
        favouriteButton.classList.add("is-favourite");
        favouriteButton.innerText = "♥";
        favouriteButton.setAttribute("aria-pressed", "true");
        favouriteButton.setAttribute(
            "aria-label",
            `Remove ${shoeName} from favourites`
        );
    }

    // Toggle favourite when clicked
    favouriteButton.addEventListener("click", () => {
        if (favourites.includes(shoeName)) {
            favourites = favourites.filter((name) => name !== shoeName);
        } else {
            favourites.push(shoeName);
        }

        localStorage.setItem("kosoko-favourites", JSON.stringify(favourites));

        updateFavouriteButton(card, shoeName);
        filterShoes();
    });
});

// Update the appearance of a heart button
function updateFavouriteButton(card, shoeName) {
    const button = card.querySelector(".favourite-btn");
    const isFavourite = favourites.includes(shoeName);

    button.classList.toggle("is-favourite", isFavourite);
    button.innerText = isFavourite ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(isFavourite));
    button.setAttribute(
        "aria-label",
        `${isFavourite ? "Remove" : "Add"} ${shoeName} ${isFavourite ? "from" : "to"} favourites`
    );
}

// Show shoes that match both the selected filter and search
function filterShoes() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    shoeCards.forEach((card) => {
        const shoeName = card.querySelector("h3").innerText.toLowerCase();
        const brandName = card.querySelector("p").innerText.toLowerCase();
        const category = card.dataset.category;

        const matchesSearch =
            shoeName.includes(searchTerm) || brandName.includes(searchTerm);

        const matchesFilter =
            activeFilter === "all" ||
            (activeFilter === "favourites" && favourites.includes(
                card.querySelector("h3").innerText.replace(/\s+/g, " ").trim()
            )) ||
            category === activeFilter;

        card.style.display = matchesSearch && matchesFilter ? "" : "none";
    });
}

// Make the category buttons work
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;

        filterButtons.forEach((filterButton) => {
            filterButton.classList.remove("active");
        });

        button.classList.add("active");
        filterShoes();
    });
});

// Make the search box work as the user types
searchInput.addEventListener("input", filterShoes);

// Display the correct shoes when the page first loads
filterShoes();
// Add shoes to the cart

 
 // Add and remove shoes from the cart
let cart = JSON.parse(localStorage.getItem("kosoko-cart")) || [];

const cartCount = document.querySelector("#cart-count");
const cartButtons = document.querySelectorAll(".add-to-cart-btn");

// Restore the cart when the page loads
function updateCart() {
    cartCount.innerText = cart.length;

    cartButtons.forEach((button) => {
        const card = button.closest(".shoe-card");
        const shoeName = card.querySelector("h3").innerText
            .replace(/\s+/g, " ")
            .trim();

        const isInCart = cart.includes(shoeName);

        button.innerText = isInCart ? "✓" : "+";
        button.setAttribute(
            "aria-label",
            isInCart ? "Remove from cart" : "Add to cart"
        );
    });

    localStorage.setItem("kosoko-cart", JSON.stringify(cart));
}

// Add or remove shoes when clicked
cartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".shoe-card");
        const shoeName = card.querySelector("h3").innerText
            .replace(/\s+/g, " ")
            .trim();

        if (cart.includes(shoeName)) {
            cart = cart.filter((name) => name !== shoeName);
        } else {
            cart.push(shoeName);
        }

        updateCart();
    });
});

// Show saved cart when the page opens
updateCart();


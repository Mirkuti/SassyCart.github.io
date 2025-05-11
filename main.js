let cart = [];

document
  .getElementById("search-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const searchQuery = document.getElementById("search").value.toLowerCase();
    const products = document.querySelectorAll(".product");

    products.forEach(function (product) {
      const productName = product
        .querySelector(".p-name")
        .textContent.toLowerCase();
      product.style.display = productName.includes(searchQuery)
        ? "block"
        : "none";
    });
  });

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    const name = this.getAttribute("data-product");
    const price = parseFloat(this.getAttribute("data-price"));

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
      (item) => item.name === name && item.price === price
    );

    if (existingItemIndex !== -1) {
      // If item exists, increase quantity
      cart[existingItemIndex].quantity += 1;
    } else {
      // If item doesn't exist, add it with quantity 1
      cart.push({ name, price, quantity: 1 });
    }

    updateCartUI();

    // Apply animation effect if available
    if (this.hasAttribute("data-micron")) {
      const effect = this.getAttribute("data-micron");
      micron.getElem(this).interaction(effect).duration(0.5).timing("ease-out");
    }
  });
});

function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  cartItems.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    itemCount += item.quantity;

    const li = document.createElement("li");
    li.className = "mb-3 d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <div>
        <span>${item.name} - ₱${item.price.toFixed(2)}</span>
        <div class="quantity-controls mt-1">
          <button class="btn btn-sm btn-secondary" onclick="decreaseQuantity(${index})">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-sm btn-secondary" onclick="increaseQuantity(${index})">+</button>
        </div>
      </div>
      <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">x</button>
    `;

    cartItems.appendChild(li);
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = itemCount;
}

function increaseQuantity(index) {
  cart[index].quantity += 1;
  updateCartUI();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    removeFromCart(index);
  }
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

document.getElementById("cart-icon").addEventListener("click", function () {
  document.getElementById("cart-sidebar").classList.toggle("show");
});

document.querySelector(".btn-success").addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  window.location.href = "checkout.html";
});

// Load cart from localStorage if available
document.addEventListener("DOMContentLoaded", function () {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartUI();
    } catch (e) {
      console.error("Error loading cart from localStorage:", e);
    }
  }
});

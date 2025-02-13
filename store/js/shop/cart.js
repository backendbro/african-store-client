document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve cart from localStorage or initialize an empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCountElement = document.querySelector(".cart-count");

  // Retrieve cart from localStorage or initialize an empty array
  // Function to update cart counter
  function updateCartCounter() {
    cartCountElement.textContent = cart.length;
  }
  updateCartCounter();

  // Function to display cart items
  function displayCartItems() {
    const cartItemList = document.querySelector(".cart-item-list");

    // Clear previous content before updating
    cartItemList.innerHTML = "";

    let totalPrice = 0; // Variable to store total cart price

    cart.forEach((item, index) => {
      totalPrice += item.quantity * item.finalPrice; // Calculate total

      const cartItem = document.createElement("li");
      cartItem.classList.add("cart-item", "align-items-center");

      cartItem.innerHTML = `
          <a href="javascript:void(0);" class="alt-font close" data-index="${index}">×</a>
          <div class="product-image">
            <a href="demo-fashion-store-single-product.html">
              <img src="${
                item.image || "../../store/images/products/default.jpg"
              }" class="cart-thumb" alt="${item.name}" />
            </a>
          </div>
          <div class="product-detail fw-600">
            <a href="demo-fashion-store-single-product.html">${item.name}</a>
            <span class="item-ammount fw-400">${
              item.quantity
            } x €${item.finalPrice.toFixed(2)}</span>
          </div>
        `;

      cartItemList.appendChild(cartItem);
    });

    // Append subtotal and checkout links
    const cartTotal = document.createElement("li");
    cartTotal.classList.add("cart-total");
    cartTotal.innerHTML = `
        <div class="fs-18 alt-font mb-15px">
          <span class="w-50 fw-500 text-start">Subtotal:</span>
          <span class="w-50 text-end fw-700">€${totalPrice.toFixed(2)}</span>
        </div>
        <a href="/cart.html" class="btn btn-large btn-transparent-light-gray border-color-extra-medium-gray">
          View cart
        </a>
        `;

    cartItemList.appendChild(cartTotal);

    // Attach event listeners to close buttons
    document.querySelectorAll(".close").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        removeCartItem(index);
      });
    });
  }

  // Function to remove item from cart
  function removeCartItem(index) {
    cart.splice(index, 1); // Remove item at the given index
    localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
    updateCartCounter();
    displayCartItems(); // Refresh the cart display
  }

  // Initial call to display cart items on page load
  displayCartItems();
});

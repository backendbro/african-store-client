document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve cart from localStorage or initialize an empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCountElement = document.querySelector(".cart-count");

  // Retrieve cart from localStorage or initialize an empty array
  // Function to update cart counter
  function updateCartCounter() {
    cartCountElement.textContent = cart.length;
  }

  // Call updateCartCounter initially to sync with localStorage
  updateCartCounter();

  // Function to display cart items in the table
  function displayCartTable() {
    const cartTableBody = document.querySelector(".cart-table-body");

    // Clear existing table content
    cartTableBody.innerHTML = "";

    let totalPrice = 0; // Variable to store total price

    cart.forEach((item, index) => {
      let itemTotal = item.quantity * item.finalPrice; // Calculate item subtotal
      totalPrice += itemTotal; // Add to total price

      const cartRow = document.createElement("tr");
      cartRow.style.marginRight = "15px";

      cartRow.innerHTML = `
          <td class="product-remove" data-id="${item.id}">
            <a href="javascript:void(0);" class="fs-20 fw-500 remove-item" data-index="${index}">×</a>
          </td>
          <td class="product-thumbnail">
            <a href="demo-jewellery-store-single-product.html">
              <img class="cart-product-image" alt="${item.name}" src="${
        item.image || "./store/images/products/default.jpg"
      }">
            </a>
          </td>
          <td class="product-name">
            <a href="demo-jewellery-store-single-product.html" class="text-dark-gray fw-500 d-block lh-initial">${
              item.name
            }</a>
            <span class="fs-14">Color: ${item.color || "N/A"}</span>
          </td>
          <td class="product-price" data-title="Price">€${item.finalPrice.toFixed(
            2
          )}</td>
          <td class="product-quantity" data-title="Quantity">
            <div class="quantity">
              <button type="button" class="qty-minus" data-index="${index}" ${
        item.quantity === 1 ? "disabled" : ""
      }>-</button>
              <input class="qty-text" type="text" value="${
                item.quantity
              }" readonly data-index="${index}" />
              <button type="button" class="qty-plus" data-index="${index}" ${
        item.quantity >= item.stock ? "disabled" : ""
      }>+</button>
            </div>
            <span class="stock-info fs-12 text-danger ${
              item.quantity >= item.stock ? "d-block" : "d-none"
            }">Max</span>
          </td>
          <td class="product-subtotal" data-title="Total" id="subtotal-${index}">€${itemTotal.toFixed(
        2
      )}</td>
        `;

      cartTableBody.appendChild(cartRow);
    });

    // Update event listeners after rendering
    updateEventListeners();

    // Display total price
    updateTotalPrice(totalPrice);
  }

  // Function to update event listeners
  function updateEventListeners() {
    // Remove item event listener
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        removeCartItem(index);
      });
    });

    // Quantity increase event listener
    document.querySelectorAll(".qty-plus").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        updateCartQuantity(index, 1);
      });
    });

    // Quantity decrease event listener
    document.querySelectorAll(".qty-minus").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        updateCartQuantity(index, -1);
      });
    });
  }

  // Function to remove item from cart
  function removeCartItem(index) {
    cart.splice(index, 1); // Remove item at index
    localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
    displayCartTable(); // Refresh cart display
  }

  function updateCartQuantity(index, change) {
    const item = cart[index];

    // Prevent quantity from going below 1
    if (item.quantity + change < 1) return;

    // Prevent quantity from exceeding available stock
    if (item.quantity + change > item.stock) return;

    // Update quantity
    item.quantity += change;
    localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage

    // Update quantity in the input field
    const quantityInput = document.querySelector(
      `.qty-text[data-index="${index}"]`
    );
    quantityInput.value = item.quantity;

    // Enable or disable the minus button if necessary
    const minusButton = document.querySelector(
      `.qty-minus[data-index="${index}"]`
    );
    minusButton.disabled = item.quantity === 1;

    // Enable or disable the plus button if necessary
    const plusButton = document.querySelector(
      `.qty-plus[data-index="${index}"]`
    );
    plusButton.disabled = item.quantity >= item.stock;

    // Show or hide stock limit warning
    const stockInfo = quantityInput
      .closest(".product-quantity")
      .querySelector(".stock-info");
    stockInfo.classList.toggle("d-block", item.quantity >= item.stock);
    stockInfo.classList.toggle("d-none", item.quantity < item.stock);

    // Update the subtotal for this item
    let itemTotal = item.quantity * item.finalPrice;
    document.getElementById(
      `subtotal-${index}`
    ).innerText = `€${itemTotal.toFixed(2)}`;

    // Recalculate the total price
    updateTotalPrice();

    // **Call updateSubtotal() to update the cart subtotal**
    updateSubtotal();
  }

  // Function to update total price dynamically
  // function updateTotalPrice() {
  //   let totalPrice = cart.reduce(
  //     (sum, item) => sum + item.quantity * item.finalPrice,
  //     0
  //   );

  //   const totalElement = document.querySelector(".cart-total");
  //   if (totalElement) {
  //     totalElement.innerHTML = `
  //       <div class="fs-18 alt-font mb-15px">
  //         <span class="w-50 fw-500 text-start">Subtotal:</span>
  //         <span class="w-50 text-end fw-700">€${totalPrice.toFixed(2)}</span>
  //       </div>
  //       <a href="./cart.html" class="btn btn-large btn-transparent-light-gray border-color-extra-medium-gray">
  //         View cart
  //       </a>
  //       <a href="checkout.html" class="btn btn-large btn-dark-gray btn-box-shadow">
  //         Checkout
  //       </a>
  //     `;
  //   }
  // }

  document.querySelector(".empty-cart").addEventListener("click", function () {
    // Clear the cart from localStorage
    localStorage.removeItem("cart");

    // Empty the cart array
    cart = [];

    // Refresh the cart UI
    displayCartTable();

    // Reset the total price
    updateTotalPrice();
  });

  function updateTotalPrice() {
    let totalPrice = cart.reduce(
      (sum, item) => sum + item.quantity * item.finalPrice,
      0
    );

    // Get selected shipping cost
    let selectedShipping = document.querySelector(
      'input[name="shipping-option"]:checked'
    );
    let shippingCost = 0;

    if (selectedShipping) {
      let label = selectedShipping.nextElementSibling;
      let match = label.textContent.match(/€([\d.]+)/);
      if (match) {
        shippingCost = parseFloat(match[1]);
      }
    }

    let finalTotal = totalPrice + shippingCost;

    // Update total in DOM
    document.querySelector(
      ".cart-subtotal"
    ).textContent = `€${totalPrice.toFixed(2)}`;
    document.querySelector(
      ".product-total"
    ).textContent = `€${finalTotal.toFixed(2)}`;
  }

  function updateShippingCostListener() {
    document
      .querySelectorAll('input[name="shipping-option"]')
      .forEach((radio) => {
        radio.addEventListener("change", updateTotalPrice);
      });
  }

  document.querySelector(".empty-cart").addEventListener("click", function () {
    localStorage.removeItem("cart");
    cart = [];
    updateTotalPrice();
  });

  updateShippingCostListener();
  updateTotalPrice();

  // function updateSubtotal() {
  //   let cart = JSON.parse(localStorage.getItem("cart")) || [];

  //   // Calculate subtotal based on selected items
  //   let subtotal = cart.reduce(
  //     (sum, item) => sum + item.finalPrice * item.quantity,
  //     0
  //   );

  //   // Update the subtotal in the HTML
  //   document.querySelector(".cart-subtotal").textContent = `€${subtotal.toFixed(
  //     2
  //   )}`;
  //   document.querySelector(".product-total").textContent = `€${subtotal.toFixed(
  //     2
  //   )}`;
  // }

  // Call updateSubtotal on page load

  //updateSubtotal();
  // Initialize cart display on page load

  const checkoutBtn = document.getElementById("checkoutBtn");

  // checkoutBtn.addEventListener("click", async function () {
  //   const paymentItems = cart.map((item, index) => {
  //     const selectedQuantity =
  //       parseInt(
  //         document.querySelector(`.qty-text[data-index="${index}"]`).value,
  //         10
  //       ) || item.quantity;

  //     return {
  //       currency: "EUR",
  //       name: item.name,
  //       // Wrap the image URL in an array. If item.image is already an array, use it;
  //       // otherwise, create a new array with the single image URL.
  //       images: Array.isArray(item.image) ? item.image : [item.image],
  //       // Use item.finalPrice if available, otherwise use item.price
  //       price: item.finalPrice || item.price,
  //       quantity: selectedQuantity,
  //     };
  //   });

  //   console.log(paymentItems);

  //   const stripe = Stripe(
  //     "pk_live_51QkSW0E0IAd5uSo1ZLavGYaBNCqzCBfu4ScIeVbBo4ps78zNyZKIrcDAE9XaQlibo4IRrDI79ZCP0uG4QRQahgZv00F8oX6nmK"
  //   );
  //   // try {
  //   //   const response = await fetch(
  //   //     "https://african-store.onrender.com/api/v1/payment/create-checkout-session",
  //   //     {
  //   //       method: "POST",
  //   //       headers: { "Content-Type": "application/json" },
  //   //       body: JSON.stringify({ items: paymentItems }),
  //   //     }
  //   //   );

  //   //   console.log(response);
  //   //   const { id } = await response.json();
  //   //   console.log(id);
  //   //   await stripe.redirectToCheckout({ sessionId: id });
  //   // } catch (err) {
  //   //   console.error(err);
  //   //   alert("Payment failed - please try again");
  //   // }

  //   console.log(paymentItems);
  // });

  checkoutBtn.addEventListener("click", async function (event) {
    // Show spinner

    // const spinner = document.querySelector(".spinner");
    // document.querySelector(".btn-double-text").style.display = "flex";
    // spinner.style.display = "inline-block";

    event.preventDefault(); // Prevents the jump to the top
    const spinner = document.querySelector(".spinner");
    const btnDoubleText = document.querySelector(".btn-double-text");

    btnDoubleText.style.display = "inline-flex";
    spinner.style.display = "inline-block"; // Show the spinner

    const paymentItems = cart.map((item, index) => {
      console.log(item);
      const selectedQuantity =
        parseInt(
          document.querySelector(`.qty-text[data-index="${index}"]`).value,
          10
        ) || item.quantity;

      return {
        currency: "EUR",
        name: item.name,
        images: Array.isArray(item.image) ? item.image : [item.image],
        price: item.finalPrice || item.price,
        quantity: selectedQuantity,
      };
    });

    // Get selected shipping method
    let selectedShipping = document.querySelector(
      'input[name="shipping-option"]:checked'
    );
    let shippingFee = 0;
    let shippingMethod = "Standard Shipping";
    let minDays = 3; // Default minimum days
    let maxDays = 7; // Default maximum days

    if (selectedShipping) {
      let label = selectedShipping.nextElementSibling;
      let match = label.textContent.match(/€([\d.]+)/);
      if (match) {
        shippingFee = parseFloat(match[1]);
      }
      shippingMethod = label.querySelector("strong").textContent.trim();

      // Extract shipping days from the label text
      if (label.textContent.includes("Same Day")) {
        minDays = 0;
        maxDays = 0;
      } else if (label.textContent.includes("Within 2 Hours")) {
        minDays = 0;
        maxDays = 0;
      } else if (label.textContent.includes("2 Business Days")) {
        minDays = 2;
        maxDays = 2;
      }
    }

    const paymentData = {
      items: paymentItems,
      shippingFee,
      shippingMethod,
      currency: "EUR",
      deliveryEstimate: {
        minimum: { unit: "business_day", value: minDays },
        maximum: { unit: "business_day", value: maxDays },
      },
    };

    console.log(paymentData); // Debugging before sending request

    const stripe = Stripe(
      "pk_live_51QkSW0E0IAd5uSo1ZLavGYaBNCqzCBfu4ScIeVbBo4ps78zNyZKIrcDAE9XaQlibo4IRrDI79ZCP0uG4QRQahgZv00F8oX6nmK"
    );

    try {
      const response = await fetch(
        "https://african-store.onrender.com/api/v1/payment/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        Swal.fire({
          title: "Payment",
          text: "Payment could not be processed. Try again",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        spinner.style.display = "none";
      }

      const { id } = await response.json();
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Payment",
        text: error.message,
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      spinner.style.display = "none";
    } finally {
      Swal.fire({
        title: "Payment",
        text: error.message,
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      spinner.style.display = "none";
    }
  });

  displayCartTable();
});

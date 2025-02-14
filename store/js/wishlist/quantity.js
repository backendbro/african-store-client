console.log("Quantity script loaded.");

// Extract the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
console.log("Product ID:", productId);

// Get token from localStorage
const token = localStorage.getItem("token");
const headers = { "Content-Type": "application/json" };
if (token) {
  headers["Authorization"] = `Bearer ${token}`;
}

// Fetch product details from backend
fetch(`https://african-store.onrender.com/api/v1/product/${productId}`, {
  method: "GET",
  headers: headers,
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    return response.json();
  })
  .then((productData) => {
    console.log("Product Data:", productData.data);

    function calculateFinalPrice(basePrice, discount, discountType) {
      let finalPrice = basePrice;
      if (discountType === "Percentage") {
        finalPrice = basePrice - (basePrice * discount) / 100;
      } else if (discountType === "Fixed Amount") {
        finalPrice = basePrice - discount;
      }
      // Ensure final price is not negative
      return finalPrice > 0 ? finalPrice : 0;
    }

    function updateSubtotal(quantity) {
      // Calculate final price using the product data from productData.data
      const finalPrice = calculateFinalPrice(
        productData.data.BasePrice,
        productData.data.Discount,
        productData.data.DiscountiscountType
      );
      console.log("Final Price:", finalPrice);

      let shippingFee = 0;
      const selectedShipping = document.querySelector(
        'input[name="shipping-option"]:checked'
      );
      if (selectedShipping) {
        shippingFee = parseFloat(selectedShipping.value) || 0;
      }

      const finalPrices = quantity * finalPrice + shippingFee;

      // Update the DOM element that shows the subtotal.
      const subtotalEl = document.querySelector(".cart-subtotal");
      if (subtotalEl) {
        subtotalEl.textContent = `€${finalPrices.toFixed(2)}`;
      }
    }

    // Use a fallback value in case StockQuantity is not provided
    const maxQuantity = productData.data.StockQuantity || 10;
    console.log("Max Quantity:", maxQuantity);

    // Select the quantity elements from the DOM
    const qtyInput = document.querySelector("#qty-text");
    const plusButton = document.querySelector("#qty-plus");
    const minusButton = document.querySelector("#qty-minus");

    // Increase quantity when plus is clicked
    plusButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      let currentQty = parseInt(qtyInput.value, 10) || 1;
      console.log("Current quantity before plus:", currentQty);
      if (currentQty < maxQuantity) {
        qtyInput.value = currentQty + 1;
        qtyInput.setAttribute("data-id", currentQty + 1);
        updateSubtotal(currentQty + 1);
      } else {
        Swal.fire({
          title: "Notice",
          text: "You have reached the maximum quantity available.",
          icon: "info",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });

    // Decrease quantity when minus is clicked
    minusButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      let currentQty = parseInt(qtyInput.value, 10) || 1;
      console.log("Current quantity before minus:", currentQty);
      if (currentQty > 1) {
        let newQty = currentQty - 1;
        qtyInput.value = newQty;
        qtyInput.setAttribute("data-id", newQty);
        updateSubtotal(newQty); // FIX: updateSubtotal with (currentQty - 1)
      }
    });

    // Validate manual input changes
    qtyInput.addEventListener("input", () => {
      let currentQty = parseInt(qtyInput.value, 10);
      if (isNaN(currentQty) || currentQty < 1) {
        qtyInput.value = 1;
      } else if (currentQty > maxQuantity) {
        qtyInput.value = maxQuantity;
        Swal.fire({
          title: "Notice",
          text: "You have reached the maximum quantity available.",
          icon: "info",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      updateSubtotal(parseInt(qtyInput.value, 10));
    });
  })
  .catch((error) => {
    console.error("Error fetching product:", error);
  });

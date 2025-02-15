console.log("Quantity script loaded");

let isInitialized = false; // Prevention flag

const initQuantity = () => {
  if (isInitialized) return;
  isInitialized = true;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  fetch(`https://african-store.onrender.com/api/v1/product/${productId}`)
    .then((response) => response.json())
    .then((productData) => {
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

      const maxQuantity = productData.data.StockQuantity;
      const qtyInput = document.querySelector("#qty-text");
      const plusButton = document.querySelector("#qty-plus");
      const minusButton = document.querySelector("#qty-minus");

      // Clone buttons to remove existing listeners
      plusButton.replaceWith(plusButton.cloneNode(true));
      minusButton.replaceWith(minusButton.cloneNode(true));

      const newPlus = document.querySelector("#qty-plus");
      const newMinus = document.querySelector("#qty-minus");

      const handlePlus = (event) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        let currentQty = parseInt(qtyInput.value, 10);
        if (currentQty < maxQuantity) {
          qtyInput.value = currentQty + 1;
          qtyInput.setAttribute("data-id", currentQty + 1);
          updateSubtotal(currentQty + 1);
        }
      };

      const handleMinus = (event) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        let currentQty = parseInt(qtyInput.value, 10);
        if (currentQty > 1) {
          qtyInput.value = currentQty - 1;
          qtyInput.setAttribute("data-id", currentQty - 1);
          updateSubtotal(currentQty - 1);
        }
      };

      newPlus.addEventListener("click", handlePlus);
      newMinus.addEventListener("click", handleMinus);

      // Rest of your logic...
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
    });
};

// Initialize after DOM loads
document.addEventListener("DOMContentLoaded", initQuantity);

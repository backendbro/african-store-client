document.addEventListener("DOMContentLoaded", async () => {
  //   if (window.productPageInitialized) return; // 🛑 Guard clause
  //   window.productPageInitialized = true;
  // Extract product ID from URL

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  console.log(productId);

  if (!productId) {
    console.error("Product ID not found in URL");
    return;
  }

  // Get authentication token (assuming it's stored in localStorage)
  const token = localStorage.getItem("token");

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // Add Authorization header **only if token exists**
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `https://african-store.onrender.com/api/v1/product/${productId}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }

    const productData = await response.json();
    console.log("Product Data:", productData.data);

    document.querySelector(
      ".page-title"
    ).innerText = `${productData.data.category.name} — ${productData.data.name}`;
    document.querySelector(".image-descri").src = productData.data.file[0];
    document.querySelector("#navigation-product").innerText =
      productData.data.name;
    document.querySelector("#single-product-name").innerText =
      productData.data.name;
    document.querySelector("#product-category").innerText =
      productData.data.category.name;
    document.querySelector("#product-description").innerText =
      productData.data.description;

    const swiperWrapperMain = document.querySelector(
      ".product-image-slider .swiper-wrapper"
    );
    const swiperWrapperThumb = document.querySelector(
      ".product-image-thumb .swiper-wrapper"
    );

    // Clear existing slides
    swiperWrapperMain.innerHTML = "";
    swiperWrapperThumb.innerHTML = "";

    // Loop through each product image and add to both Swipers
    let slidesMain = [];
    let slidesThumb = [];

    productData.data.file.forEach((file, index) => {
      const imgAlt = productData.data.name || `Product Image ${index + 1}`;

      // Add to main slider
      slidesMain.push(`
          <div class="swiper-slide gallery-box" role="group" aria-label="${
            index + 1
          } / ${productData.data.file.length}">
            <a href="${file}" data-group="lightbox-gallery" title="${imgAlt}">
              <img class="w-100" alt="${imgAlt}" src="${file}" data-no-retina="">
            </a>
          </div>
        `);

      // Add to thumbnail slider
      slidesThumb.push(`
          <div class="swiper-slide" role="group" aria-label="${index + 1} / ${
        productData.data.file.length
      }" style="margin-bottom: 15px;">
            <img class="w-100" alt="${imgAlt}" src="${file}" data-no-retina="">
          </div>
        `);
    });

    // Insert slides into the DOM
    swiperWrapperMain.innerHTML = slidesMain.join("");
    swiperWrapperThumb.innerHTML = slidesThumb.join("");

    // ✅ Reinitialize Swiper to recognize new slides
    setTimeout(() => {
      if (typeof Swiper !== "undefined") {
        const thumbSwiper = new Swiper(".product-image-thumb", {
          spaceBetween: 15,
          slidesPerView: "auto",
          direction: "vertical",
          navigation: {
            nextEl: ".swiper-thumb-next",
            prevEl: ".swiper-thumb-prev",
          },
        });

        new Swiper(".product-image-slider", {
          spaceBetween: 10,
          loop: slidesMain.length > 1,
          autoplay: {
            delay: 2000,
            disableOnInteraction: false,
          },
          navigation: {
            nextEl: ".slider-product-next",
            prevEl: ".slider-product-prev",
          },
          thumbs: {
            swiper: thumbSwiper,
          },
        });
      }
    }, 100);

    if (productData.data) {
      WishlistService.fetchWishlist().then((wishlist) => {
        const isWishlisted = wishlist.some(
          (item) => item._id == productData.data._id
        );
        console.log(isWishlisted);
        if (isWishlisted) {
          console.log(document.querySelector(".wishlister"));
          document.querySelector(".wishlister").classList.add("added");
        }
      });
    }

    const button = document.querySelector(".wishlister");
    button.addEventListener("click", async (event) => {
      if (!button) return;

      event.preventDefault();

      if (!token) {
        Swal.fire({
          title: "Not logged In!",
          text: "Please log in to complete this action.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });

        setTimeout(() => {
          window.location.href = "/account.html";
        }, 2000);
        return;
      }

      console.log(productId);

      try {
        const response = await fetch(
          "https://african-store.onrender.com/api/v1/wishlist",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId }),
          }
        );

        console.log(response);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          if (data.message == "Added to wishlist") {
            console.log(`FROM ADDED: ${data.message}`);
            document.querySelector(".wishlister").classList.add("added"); // Indicate it's been added

            Swal.fire({
              title: "Wishlist",
              text: data.message,
              icon: "success",
              showConfirmButton: false,
              timer: 2000, // Auto close in 2 seconds
            });
          } else if (data.message == "Removed from wishlist") {
            console.log(`FROM REMOVED: ${data.message}`);
            document.querySelector(".wishlister").classList.remove("added");
            Swal.fire({
              title: "Wishlist",
              text: "Removed from wishlist",
              icon: "success",
              showConfirmButton: false,
              timer: 2000, // Auto close in 2 seconds
            });
          }
        } else {
          Swal.fire({
            title: "Wishlist",
            text: data.message || "Failed to add product to wishlist.",
            icon: "success",
            showConfirmButton: false,
            timer: 2000, // Auto close in 2 seconds
          });
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        Swal.fire({
          title: "Wishlist",
          text: error.message || "Failed to add product to wishlist.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000, // Auto close in 2 seconds
        });
      }
    });

    // Clear existing slides
    // Get the input element
    // Get the input element

    // Display product details on the page (example)

    const trimmedId = productData.data._id.substring(0, 8);
    // let Discount = productData.data.Discount
    //   ? productData.data.BasePrice * (productData.data.Discount / 100)
    //   : 0;
    //let finalPrice = Math.round(productData.data.BasePrice - Discount);

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
    const finalPrice = calculateFinalPrice(
      productData.data.BasePrice,
      productData.data.Discount,
      productData.data.DiscountiscountType
    );

    document.querySelector(".cart-subtotal").innerText = `€${finalPrice}`;
    document.querySelector("#navigation-product").textContent =
      productData.data.name;
    document.querySelector("#category-name").textContent =
      productData.data.category.name;
    document.querySelector("#product-description").textContent =
      productData.data.description;
    document.querySelector("#sku").innerText = trimmedId;

    document.querySelector(".product-price").innerHTML = `
    
    <span class="text-dark-gray fs-28 xs-fs-24 fw-700 ls-minus-1px"> 
        ${
          productData.data.Discount && productData.data.Discount > 0
            ? `<del class="text-medium-gray  me-10px fw-400">€${productData.data.BasePrice.toFixed(
                2
              )}</del> €${finalPrice.toFixed(2)}`
            : `€${productData.data.BasePrice.toFixed(2)}`
        }
          </span>
      
    `;
    // <span class="text-dark-gray fs-28 xs-fs-24 fw-700 ls-minus-1px">
    //   ${
    //     productData.data.Discount
    //       ? `<del class="text-medium-gray me-10px fw-400">€${productData.data.BasePrice}</del>`
    //       : ""
    //   }
    //   €${finalPrice}
    // </span>

    function displayCartItems() {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
    }
    const cartCountElement = document.querySelector(".cart-count");
    // Retrieve cart from localStorage or initialize an empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Function to update cart counter
    function updateCartCounter() {
      cartCountElement.textContent = cart.length;
    }

    updateCartCounter();

    document.querySelector(".cartier").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation(); // Prevent any parent handlers from interfering

      // Use event.currentTarget to refer to the element with the listener
      const btn = event.currentTarget;
      console.log("clicked");

      // Ensure productData is available
      if (!productData || !productData.data) {
        console.error("Product data not available");
        Swal.fire({
          title: "Error",
          text: "Product details are missing. Please try again.",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }

      // Use productData from the fetch
      const productId = productData.data._id;
      const productName = productData.data.name;
      const productPrice = productData.data.BasePrice;
      const productStock = productData.data.StockQuantity;
      const productImage = productData.data.file[0];

      // Validate product details
      if (
        !productId ||
        !productName ||
        isNaN(productPrice) ||
        isNaN(productStock) ||
        !productImage
      ) {
        console.error("Invalid product data:", {
          productId,
          productName,
          productPrice,
          productStock,
          productImage,
        });
        Swal.fire({
          title: "Error",
          text: "Invalid product details. Please try again.",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }

      // Create the product object
      const productObject = {
        id: productId,
        name: productName,
        finalPrice: productPrice,
        image: productImage,
        StockQuantity: productStock,
        quantity: 1,
      };

      // Check if the product already exists in the cart
      const existingProduct = cart.find((item) => item.id === productId);
      if (existingProduct) {
        Swal.fire({
          title: "Product",
          text: "Product already added",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        cart.push(productObject);
        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCounter();
        displayCartItems();
        Swal.fire({
          title: "Product",
          text: "Product successfully added",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });

    function updateCartTotalDisplay(quantity) {
      // Get the shipping fee from the selected shipping option

      if (quantity <= 0) {
        quantity = 1;
      }

      const total = finalPrice * quantity;
      let shippingFee = 0;
      const selectedShipping = document.querySelector(
        'input[name="shipping-option"]:checked'
      );
      if (selectedShipping) {
        // Parse the value (assuming the value is set to the fee, e.g., "5" for €5)
        shippingFee = parseFloat(selectedShipping.value) || 0;
      }

      const finalTotal = total + shippingFee;

      // Update the element that displays the cart total.
      const cartTotalEl = document.querySelector(".cart-subtotal");
      if (cartTotalEl) {
        cartTotalEl.textContent = `€${finalTotal.toFixed(2)}`;
      }
    }

    document
      .querySelectorAll('input[name="shipping-option"]')
      .forEach((radio) => {
        radio.addEventListener("change", () => {
          // Assume finalPrice is defined in your product fetch code and quantity from the qtyInput.

          // finalPrice should be defined in the outer scope from your product fetch
          updateCartTotalDisplay(
            document.querySelector("#qty-text").getAttribute("data-id")
          );
        });
      });

    // Fetch product details
    try {
      // (Optional) Initialize image sliders or other UI components as needed...

      // Set up the "Buy" button to create a payment session
      const checkoutBtn = document.getElementById("checkoutBtn");
      checkoutBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        // Show a spinner while processing (assumes an element with class "spinner" exists)
        const spinner = document.querySelector(".spinner");
        if (spinner) spinner.style.display = "inline-block";

        // Get the quantity from the input (assumes an element with class "qty-text" exists)
        const qtyInput = document.querySelector(".qty-text");
        const quantity = parseInt(qtyInput.getAttribute("data-id"));
        console.log(`FROM PAYMENT: ${quantity}`);

        // Retrieve the selected shipping option (assumes radio buttons with name "shipping-option" exist)
        const selectedShipping = document.querySelector(
          'input[name="shipping-option"]:checked'
        );

        let shippingFee = 0;
        let shippingMethod = "Standard Shipping";
        let minDays = 3; // Default minimum
        let maxDays = 7; // Default maximum

        if (selectedShipping) {
          const label = selectedShipping.nextElementSibling;
          const match = label.textContent.match(/€([\d.]+)/);
          if (match) {
            shippingFee = parseFloat(match[1]);
          }
          // Extract shipping method from the <strong> inside the label if available.
          if (label.querySelector("strong")) {
            shippingMethod = label.querySelector("strong").textContent.trim();
          }
          // Adjust delivery estimates based on label text
          if (
            label.textContent.includes("Same Day") ||
            label.textContent.includes("Within 2 Hours")
          ) {
            minDays = 0;
            maxDays = 0;
          } else if (label.textContent.includes("2 Business Days")) {
            minDays = 2;
            maxDays = 2;
          }
        }

        const price = document.querySelector(".cart-subtotal");
        console.log(price.textContent);

        // Build the payment item (for a single product)
        const paymentItems = [
          {
            currency: "EUR",
            name: productData.data.name,
            images: Array.isArray(productData.data.file)
              ? productData.data.file
              : [productData.data.file],
            price: finalPrice,
            quantity: quantity,
          },
        ];

        // Construct the payment payload
        const paymentData = {
          items: paymentItems,
          shippingFee: shippingFee,
          shippingMethod: shippingMethod,
          currency: "EUR",
          deliveryEstimate: {
            minimum: { unit: "business_day", value: minDays },
            maximum: { unit: "business_day", value: maxDays },
          },
        };

        console.log("Payment Data:", paymentData);

        // Initialize Stripe (replace with your actual public key)
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
              text: "Payment could not be processed. Please try again.",
              icon: "error",
              showConfirmButton: false,
              timer: 2000,
            });
            if (spinner) spinner.style.display = "none";
            return;
          }
          const { id } = await response.json();
          console.log("Checkout session id:", id);
          await stripe.redirectToCheckout({ sessionId: id });
        } catch (err) {
          console.error("Payment error:", err);
          Swal.fire({
            title: "Payment",
            text: err.message || "Payment failed. Please try again.",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
          if (spinner) spinner.style.display = "none";
        }
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    }

    // Store the product and payment details in localStorage
  } catch (error) {
    console.error("Error fetching product:", error);
  }
});

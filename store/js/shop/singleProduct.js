document.addEventListener("DOMContentLoaded", async () => {
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

    if (productData.data.isWishlisted) {
      console.log(document.querySelector(".wishlister"));
      document.querySelector(".wishlister").classList.add("added");
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
    let Discount = productData.data.Discount
      ? productData.data.BasePrice * (productData.data.Discount / 100)
      : 0;
    let finalPrice = Math.round(productData.data.BasePrice - Discount);

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
      productData.data.Discount
        ? `<del class="text-medium-gray me-10px fw-400">€${productData.data.BasePrice}</del>`
        : ""
    }
    €${finalPrice}
  </span>

  `;

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
        Swal.fire({
          title: "Product",
          text: "Product successfully added",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });

    // Store the product and payment details in localStorage
  } catch (error) {
    console.error("Error fetching product:", error);
  }
});

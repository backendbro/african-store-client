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
  if (!token) {
    console.error("User is not authenticated");
    return;
  }

  try {
    const response = await fetch(
      `https://african-store.onrender.com/api/v1/product/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }

    const productData = await response.json();
    console.log("Product Data:", productData.data);

    document.querySelector(".image-descri").src = productData.data.file[0];
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
          window.location.href = "/login.html";
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
    const qtyInputElement = document.querySelector(".qty-text");
    qtyInputElement.value = parseInt(productData.data.StockQuantity); // Set the initial value (can be adjusted based on your needs)

    const minusButton = document.querySelector(".qty-minus");
    const plusButton = document.querySelector(".qty-plus");

    // Get the max quantity from the backend (productData.data.StockQuantity)
    const maxQuantity = parseInt(productData.data.StockQuantity);

    // Update the quantity based on user interaction
    minusButton.addEventListener("click", () => {
      let currentQuantity = parseInt(qtyInputElement.value);
      if (currentQuantity > 1) {
        qtyInputElement.value = currentQuantity - 1; // Decrease quantity
      }
    });

    plusButton.addEventListener("click", () => {
      let currentQuantity = parseInt(qtyInputElement.value, 10);

      // Disable plus button and change pointer when the current quantity reaches max quantity
      if (currentQuantity >= maxQuantity) {
        plusButton.disabled = true;
        plusButton.style.pointerEvents = "none";
        plusButton.style.cursor = "not-allowed"; // Indicate the button is disabled
      } else {
        plusButton.disabled = false;
        plusButton.style.pointerEvents = "auto"; // Re-enable interaction
        plusButton.style.cursor = "pointer"; // Revert to normal pointer
        qtyInputElement.value = currentQuantity + 1; // Increase quantity
      }
    });

    // Display product details on the page (example)

    const trimmedId = productData.data._id.substring(0, 8);
    let Discount = productData.data.Discount
      ? productData.data.BasePrice * (productData.data.Discount / 100)
      : 0;
    let finalPrice = Math.round(productData.data.BasePrice - Discount);

    document.querySelector("#productPrice").textContent =
      productData.data.BasePrice;

    document.querySelector("#navigation-product").textContent =
      productData.data.name;
    document.querySelector("#category-name").textContent =
      productData.data.category.name;
    document.querySelector("#product-description").textContent =
      productData.data.description;
    document.querySelector("#sku").textContent = trimmedId;
    document.querySelector("#product-category").textContent =
      productData.data.category.name;
    document.querySelector(".product-info2 h4").textContent =
      productData.data.name;
    document.querySelector("#image-description").src = productData.data.file[0];
    document.querySelector(
      ".product-price2 span"
    ).textContent = `€${productData.data.price}`;

    // Define the payment item with price data
    const paymentItem = {
      currency: "EUR",
      name: productData.data.name,
      images: productData.data.file || [], // Pass all images, default to empty array if none
      price: parseInt(finalPrice), // Convert price to cents
      quantity: parseInt(qtyInputElement.value), // Send the correct quantity
    };

    localStorage.setItem("paymentItem", JSON.stringify(paymentItem));
    // Store the product and payment details in localStorage
  } catch (error) {
    console.error("Error fetching product:", error);
  }
});

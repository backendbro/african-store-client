document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const limit = 4; // Number of products to show in the slider

  // API endpoint for fetching products from a specific category (Health & Beauty)
  const apiUrl =
    "https://african-store.onrender.com/api/v1/category/frontend/67aee104e89642a8fe6ae20a";

  // Fetch products from the category
  async function fetchCategoryProducts() {
    try {
      const response = await fetch(`${apiUrl}?page=1&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log("Fetched category products:", result);
      return result.data.products || [];
    } catch (error) {
      console.error("Error fetching category products:", error);
      return [];
    }
  }

  // Function to initialize the slider with products
  function initializeProductSlider(productsArray) {
    const sliderWrapper = document.querySelector("#swipper-w");
    if (!sliderWrapper) {
      console.error("Slider wrapper element not found.");
      return;
    }
    sliderWrapper.innerHTML = ""; // Clear existing content

    // Generate slides from productsArray
    const slidesHTML = productsArray
      .map(
        (product) => `
  <div class="swiper-slide ${
    product.StockQuantity === 0 ? "out-of-stock" : ""
  }">
    <div class="interactive-banner-style-09 border-radius-6px overflow-hidden position-relative">
      <img src="${product.image}" alt="${product.name}" />

      <div class="opacity-full bg-gradient-gray-light-dark-transparent"></div>

      <div class="image-content h-100 w-100 ps-15 pe-15 pt-11 pb-11 lg-p-11 d-flex justify-content-bottom align-items-start flex-column">
        <div class="mt-auto d-flex align-items-start w-100 z-index-1 position-relative overflow-hidden flex-column">
          <span class="text-white fw-700 fs-22 p-2 bg-dark opacity-90 rounded shadow">${
            product.name
          }</span>
          ${
            product.price
              ? `<span class="text-white fw-700 fs-18 p-2 bg-dark opacity-90 rounded shadow mt-1">€${product.price}</span>`
              : ""
          }
        </div>

        <!-- Show "Out of Stock" in Red -->
        ${
          product.StockQuantity === 0
            ? `<span class="text-danger out-of-stock-text fw-bold fs-20 mt-2" style="color: red !important;">Out of Stock</span>`
            : ""
        }

        <div class="position-absolute left-0px top-0px w-100 h-100 bg-gradient-regal-blue-transparent opacity-9"></div>
        <div class="box-overlay bg-gradient-gray-light-dark-transparent"></div>

        <!-- Disable click if out of stock -->
        <a href="${
          product.StockQuantity > 0 ? product.link : "javascript:void(0);"
        }" 
           class="position-absolute z-index-1 top-0px left-0px h-100 w-100 ${
             product.StockQuantity === 0 ? "disabled-link" : ""
           }">
        </a>
      </div>
    </div>
  </div>
  `
      )
      .join("");

    sliderWrapper.innerHTML = slidesHTML;

    // Apply JavaScript-based styling to Out of Stock text
    document.querySelectorAll(".out-of-stock-text").forEach((el) => {
      el.style.color = "red";
      console.log(el);
    });

    // Initialize Swiper
    new Swiper(".slider-three-slide", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: productsArray.length > 1,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".slider-one-slide-next-1",
        prevEl: ".slider-one-slide-prev-1",
      },
      pagination: {
        el: ".slider-four-slide-pagination-1",
        clickable: true,
        dynamicBullets: false,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        1400: { slidesPerView: 4 },
        1024: { slidesPerView: 3 },
        768: { slidesPerView: 3 },
        576: { slidesPerView: 2 },
        320: { slidesPerView: 1 },
      },
      effect: "slide",
    });
  }

  // Add styles to indicate out-of-stock items
  const style = document.createElement("style");
  style.innerHTML = `
  .out-of-stock {
    filter: grayscale(100%) opacity(0.5);
  }
  .disabled-link {
    pointer-events: none;
    cursor: not-allowed;
  }
  .text-danger {
    color: red !important;
  }
  .out-of-stock-text {
    color: red !important;
  }
`;
  document.head.appendChild(style);

  // Fetch the products and then initialize the slider
  const productsData = await fetchCategoryProducts();

  // Map the fetched products to the structure expected by the slider.
  const sliderProducts = productsData.map((prod) => ({
    name: prod.name,
    image: prod.file && prod.file.length ? prod.file[0] : "",
    price: prod.BasePrice ? prod.BasePrice.toFixed(2) : null,
    link: `https://www.africanmarkets.eu/store/single%20product/single-product.html?id=${prod._id}`,
    StockQuantity: prod.StockQuantity || 0, // Ensure StockQuantity is included
  }));

  console.log("Carousel details", sliderProducts);
  initializeProductSlider(sliderProducts);
});

// Add styles to indicate out-of-stock items
const style = document.createElement("style");
style.innerHTML = `
  .out-of-stock {
    filter: grayscale(100%) opacity(0.5);
    pointer-events: none;
  }
  .disabled-link {
    cursor: not-allowed;
    background: rgba(0, 0, 0, 0.4);
  }
`;
document.head.appendChild(style);

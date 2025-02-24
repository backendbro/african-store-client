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
      // Assume result.data is an array of products
      if (result.data.products && result.data.products.length > 0) {
        return result.data.products;
      } else {
        return [];
      }
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
      <div class="swiper-slide">
        <div class="interactive-banner-style-09 border-radius-6px overflow-hidden position-relative">
          <img src="${product.image}" alt="${product.name}" />
          <div class="opacity-full bg-gradient-gray-light-dark-transparent"></div>
          <div class="image-content h-100 w-100 ps-15 pe-15 pt-11 pb-11 lg-p-11 d-flex justify-content-bottom align-items-start flex-column">
            <div class="mt-auto d-flex align-items-start w-100 z-index-1 position-relative overflow-hidden flex-column">
              <span class="text-white fw-500 fs-22">${product.name}</span>
              ${
                product.price
                  ? `<span class="text-white fs-18 mt-1">€${product.price}</span>`
                  : ""
              }
            </div>
            <div class="position-absolute left-0px top-0px w-100 h-100 bg-gradient-regal-blue-transparent opacity-9"></div>
            <div class="box-overlay bg-gradient-gray-light-dark-transparent"></div>
            <a href="${
              product.link || "#"
            }" class="position-absolute z-index-1 top-0px left-0px h-100 w-100"></a>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    sliderWrapper.innerHTML = slidesHTML;

    // Determine loop mode based on the number of slides
    const loopMode = productsArray.length > 1;

    // Initialize Swiper with proper selectors
    new Swiper(".slider-three-slide", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: loopMode,
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

  // Fetch the products and then initialize the slider
  const productsData = await fetchCategoryProducts();
  console.log(`productData: ${productsData}`);

  // Map the fetched products to the structure expected by the slider.
  const sliderProducts = productsData.map((prod) => ({
    name: prod.name,
    image: prod.file && prod.file.length ? prod.file[0] : "",
    price: prod.BasePrice ? prod.BasePrice.toFixed(2) : null,
    link: `https://www.africanmarkets.eu/store/single%20product/single-product.html?id=${prod._id}`, // Update URL as needed
  }));

  console.log(`Carousel details ${sliderProducts}`);
  initializeProductSlider(sliderProducts);
});

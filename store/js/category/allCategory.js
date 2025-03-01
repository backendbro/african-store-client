document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("category-container");

  async function fetchCategories(page = 1, limit = 13) {
    try {
      // Show the spinner

      const cartCountElement = document.querySelector(".cart-count");

      // Retrieve cart from localStorage or initialize an empty array
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Function to update cart counter
      function updateCartCounter() {
        cartCountElement.textContent = cart.length;
      }

      // Call updateCartCounter initially to sync with localStorage
      updateCartCounter();

      const response = await fetch(
        `https://african-store.onrender.com/api/v1/category/frontend?page=${page}&limit=${limit}`
      );
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        displayCategories(data.data);
      } else {
        console.error("Invalid data format:", data);
        return;
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      return;
    }
  }

  function displayCategories(categories) {
    console.log(categories);

    container.innerHTML = ""; // Clear existing content

    if (!categories) {
      categoryContainer.innerHTML =
        "<p style='text-align: center; color: red;'>Failed to load categories.</p>";
    }

    categories.forEach((category) => {
      const productLink = `https://www.africanmarkets.eu/store/single-category%20page/index.html?id=${category._id}`;
      const categoryElement = document.createElement("div");
      categoryElement.className =
        "grid__item small--one-half medium-up--one-quarter";
      categoryElement.innerHTML = `
            <div class="collection-grid-item">
              <a href="${productLink}" class="collection-grid-item__link">
                <div class="collection-grid-item__overlay" style="background-image: url(${category.categoryDisplay});"></div>
                <div class="collection-grid-item__title-wrapper">
                  <h3 class="collection-grid-item__title">${category.name}</h3>
                </div>
              </a>
            </div>
          `;
      container.appendChild(categoryElement);
    });
  }

  // Fetch and display categories on page load
  fetchCategories();
});

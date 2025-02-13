document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  const url = "https://african-store.onrender.com/api/v1/category";
  const categoryContainer = document.querySelector(".mega-menu .row");

  // Show loading spinner
  categoryContainer.innerHTML = `
            <div class="cat-loading-spinner">
              <div class="cat-spinner"></div>
            </div>
          `;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const categories = data?.data?.slice(0, 5); // Only first 5 categories

    // Remove spinner
    categoryContainer.innerHTML = "";

    // Add fetched categories
    categories.forEach((category) => {
      categoryContainer.innerHTML += `
            <div class="col md-mb-25px">
              <a href="https://www.africanmarkets.eu/store/single-category%20page/index.html?id=${category.id}" class="justify-content-center mb-10px">
                <img src="${category.categoryDisplay}" class="border-radius-4px w-100" alt="${category.name}" />
              </a>
              <a href="https://www.africanmarkets.eu/store/single-category%20page/index.html?id=${category.id}" class="btn btn-hover-animation fw-500 text-uppercase-inherit justify-content-center pt-0 pb-0">
                <span>
                  <span class="btn-text text-dark-gray fs-17">${category.name}</span>
                  <span class="btn-icon">
                    <i class="fa-solid fa-arrow-right icon-very-small w-auto"></i>
                  </span>
                </span>
              </a>
            </div>
          `;
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    categoryContainer.innerHTML =
      "<p style='text-align: center; color: red;'>Failed to load categories.</p>";
  }
});

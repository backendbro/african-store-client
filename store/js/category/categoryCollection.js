document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  const url = "https://african-store.onrender.com/api/v1/category";
  const gridContainer = document.querySelector(".grid.grid--uniform");

  // if (!token) {
  //   Swal.fire({
  //     title: "Invalid credentials",
  //     text: "You are not allowed to complete this action, please log in",
  //     icon: "error",
  //     showConfirmButton: false,
  //     timer: 2000,
  //   });
  //   window.location.href = "/account.html";
  // }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log(data);
    if (!data.success) {
      return;
    }

    const categories = data?.data?.slice(0, 11);

    // Remove spinner
    gridContainer.innerHTML = "";

    // Add 'View All Products' box first
    gridContainer.innerHTML = `
          <div class="grid__item small--one-half medium-up--one-quarter">
            <div class="collection-grid-item">
              <a href="/store/shop-categories/categories.html" class="collection-grid-item__link">
                <div class="collection-grid-item__overlay" style="background-image: url('https://www.osiafrik.com/cdn/shop/collections/IMG-20180602-WA0006_3b81a974-17d5-4ed6-86de-8f399d55447e_250x250_crop_top@2x.jpg?v=1587489409');"></div>
                <div class="collection-grid-item__title-wrapper">
                  <h3 class="collection-grid-item__title">VIEW ALL PRODUCTS</h3>
                </div>
              </a>
            </div>
          </div>
        `;

    // Add fetched categories
    categories?.forEach((category) => {
      gridContainer.innerHTML += `
            <div class="grid__item small--one-half medium-up--one-quarter">
              <div class="collection-grid-item">
                <a href="./store/single-category%20page/index.html?id=${category.id}" class="collection-grid-item__link">
                  <div class="collection-grid-item__overlay" style="background-image: url('${category.categoryDisplay}');"></div>
                  <div class="collection-grid-item__title-wrapper">
                    <h3 class="collection-grid-item__title">${category.name}</h3>
                  </div>
                </a>
              </div>
            </div>
          `;
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Inject responsive CSS rules for the search form
  const style = document.createElement("style");
  style.innerHTML = `
    /* For screens 768px and above, show the search form and results side by side */
    
    @media (max-width: 767px) {
    .search-form-wrapper .search-form-box {
        width: 60%%;
      margin-left: 20px;
        }

  .search-results {
   
    display: block;
    width: 100%;
      }
    }

@media (max-width: 575px) {
    .search-form-wrapper .search-form .search-input {
        font-size: 15px;
        height: 50px;
        margin-left: 20px;
    }
}
    
   

      

  `;
  document.head.appendChild(style);

  const searchInput = document.querySelector(".search-input");
  const searchForm = document.getElementById("search-form");
  const searchResultsContainer = document.querySelector(".search-results");
  const productListContainer = document.querySelector(".product-list");

  if (!searchResultsContainer || !productListContainer) {
    console.error("Search results container not found!");
    return;
  }

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    // Show loading state
    searchResultsContainer.style.display = "block";
    productListContainer.innerHTML = `<p style="text-align:center; font-weight:bold;">Searching...</p>`;

    try {
      const response = await fetch(
        `https://african-store.onrender.com/api/v1/search/search?q=${query}`
      );
      const data = await response.json();

      console.log(data);
      productListContainer.innerHTML = "";

      if (data.products.length === 0 && data.categories.length === 0) {
        productListContainer.innerHTML =
          "<p style='text-align:center;'>No results found</p>";
        return;
      }

      // Render Products
      data.products.forEach((product) => {
        const productItem = document.createElement("li");
        productItem.classList.add("product-item");

        const productLink = `https://www.africanmarkets.eu/store/single%20product/single-product.html?id=${product._id}`;

        productItem.innerHTML = `
          <div class="product-box">
            <div class="product-image">
              <a href="${productLink}">
                <img src="${
                  product.file[0] ||
                  "https://i.pinimg.com/474x/68/cb/f4/68cbf40113d88a2a6a63b937740a292f.jpg"
                }" alt="${product.name}" />
                <div class="product-overlay"></div>
              </a>
            </div>
            <div class="product-info" style="text-align:center; padding:10px;">
              <a href="${productLink}" class="product-name" style="font-weight:bold; display:block; margin-bottom:5px;">
                ${product.name}
              </a>
            </div>
          </div>
        `;

        productListContainer.appendChild(productItem);
      });

      // Render Categories
      if (data.categories.length > 0) {
        const categoryContainer = document.createElement("div");
        categoryContainer.style.marginTop = "20px";
        categoryContainer.innerHTML = `<h3 style="text-align:center; margin-bottom:10px;">Categories</h3>`;

        data.categories.forEach((category) => {
          const categoryItem = document.createElement("div");
          Object.assign(categoryItem.style, {
            display: "flex",
            alignItems: "center",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginBottom: "10px",
            background: "#f9f9f9",
            transition: "0.3s",
          });

          categoryItem.addEventListener("mouseover", () => {
            categoryItem.style.background = "#e6e6e6";
          });

          categoryItem.addEventListener("mouseleave", () => {
            categoryItem.style.background = "#f9f9f9";
          });

          categoryItem.innerHTML = `
            <img src="${
              category.categoryDisplay ||
              "https://i.pinimg.com/236x/9f/8f/83/9f8f832912f54615fe003d7f9d7a2eb0.jpg"
            }" alt="${
            category.name
          }" style="width:50px; height:50px; border-radius:5px; margin-right:15px;" />
            <a href="https://www.africanmarkets.eu/store/single-category%20page/index.html?id=${
              category.id
            }" style="text-decoration:none; font-weight:bold; color:#333;">
              ${category.name}
            </a>
          `;

          categoryContainer.appendChild(categoryItem);
        });

        productListContainer.appendChild(categoryContainer);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      productListContainer.innerHTML =
        "<p style='text-align:center;color:red;'>Failed to load results.</p>";
    }
  });

  // Hide results when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !searchForm.contains(event.target) &&
      !searchResultsContainer.contains(event.target)
    ) {
      searchResultsContainer.style.display = "none";
    }
  });
});

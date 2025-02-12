document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  console.log(productId);

  if (!productId) {
    console.error("Product ID not found in URL");
    return;
  }

  let currentPage = 1;
  const limit = 5; // Adjust as needed
  const apiUrl = `https://african-store.onrender.com/api/v1/category/frontend/${productId}`;

  const token = localStorage.getItem("token");
  const productList = document.querySelector(".product-list");
  const paginationContainer = document.querySelector(".pagination");

  if (!token) {
    console.log("NO TOKEN FOUND");
    return;
  }

  async function fetchProducts(page) {
    console.log(apiUrl);
    try {
      const response = await fetch(`${apiUrl}?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      console.log(result);
      if (result.success) {
        renderProducts(result.data.products, result.data.category, result);
        updatePagination(result.pagination);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return;
    }
  }

  // Retrieve cart from localStorage or initialize an empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderProducts(products, category, results) {
    console.log(category);
    const heroImage = document.querySelector(".collection-hero__image");

    if (heroImage) {
      heroImage.style.backgroundImage = `url(${category.categoryDisplay})`;
      heroImage.style.backgroundSize = "cover"; // Ensures the image covers the element
      heroImage.style.backgroundPosition = "center"; // Centers the image
    } else {
      console.error("Element .collection-hero__image not found");
    }

    document.querySelector(".title").textContent = category.name;
    document.querySelector("#title").textContent = category.name;
    document.querySelector(".category-description").textContent =
      category.description;
    document.getElementById("product_count").innerHTML = results.count;

    productList.innerHTML = ""; // Clear previous items

    const cartCountElement = document.querySelector(".cart-count");

    // Retrieve cart from localStorage or initialize an empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Function to update cart counter
    function updateCartCounter() {
      cartCountElement.textContent = cart.length;
    }

    // Call updateCartCounter initially to sync with localStorage
    updateCartCounter();

    if (results.count === 0) {
      return (productList.innerHTML = "<p> No product for this category </p>");
    }

    products.forEach((product) => {
      let Discount = product.Discount
        ? product.BasePrice * (product.Discount / 100)
        : 0;
      let finalPrice = Math.round(product.BasePrice - Discount);
      let isNew = isProductNew(product.createdAt);

      const productItem = document.createElement("li");
      productItem.classList.add("product-item");

      const productLink = `https://www.africanmarkets.eu/store/single%20product/single-product.html?id=${product._id}`;

      productItem.innerHTML = `
      <div class="product-box">
        <div class="product-image">
          <a href="${productLink}">
            <img src="${
              product.file[0] ||
              "https://i.pinimg.com/736x/1c/16/62/1c1662f546cc85a1d77732c840ff9113.jpg"
            }" alt="${product.name}" />
            ${isNew ? `<span class="label">New</span>` : ""}
            <div class="product-overlay"></div>
          </a>
          
          <div class="product-buttons">
            <button class="add-to-cart"
              data-id="${product._id}" 
              data-name="${product.name}" 
              data-price="${finalPrice}" 
              data-image="${product.file[0]}"
              data-stock="${product.StockQuantity}">
              <i class="feather icon-feather-shopping-bag"></i>
              <span>Add to cart</span>
            </button>
          </div>
    
          <div class="product-actions">
            <ul>
              <li>
                <button class="add-to-wishlist"
                  data-id="${product._id}"
                  title="Add to wishlist">
                  <i class="feather icon-feather-heart fs-16"></i>
                </button>
              </li>
              <li>
                <a href="${productLink}" title="Quick shop">
                  <i class="feather icon-feather-eye fs-16"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
    
        <div class="product-info">
          <a href="${productLink}" class="product-name">${product.name}</a>
          <div class="product-price">
            ${product.Discount ? `<del>€${product.BasePrice}</del>` : ""}
            €${finalPrice}
          </div>
        </div>
      </div>
    `;

      productList.appendChild(productItem);
    });

    // Attach event listeners to "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();

        const productId = event.target.getAttribute("data-id");
        const productName = event.target.getAttribute("data-name");
        const productPrice = parseFloat(
          event.target.getAttribute("data-price")
        );
        const productStock = parseInt(
          event.target.getAttribute("data-stock"),
          10
        );
        const productImage = event.target.getAttribute("data-image");

        // Create product object
        const productObject = {
          id: productId,
          name: productName,
          finalPrice: productPrice,
          image: productImage,
          StockQuantity: productStock,
          quantity: 1, // Initialize quantity as 1
        };

        // Check if product is already in cart
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

          // Update cart counter
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
    });
  }

  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".add-to-wishlist");
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

    const productId = button.getAttribute("data-id");
    console.log(productId);

    try {
      const response = await fetch(
        "https://african-store.onrender.com/api/v1/wishlist",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          Authorization: `Bearer ${token}`,
          body: JSON.stringify({ productId }),
        }
      );

      console.log(response);
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        button.classList.add("added"); // Indicate it's been added
        alert("Product added to wishlist!");
      } else {
        alert(data.message || "Failed to add product to wishlist.");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("An error occurred. Please try again.");
    }
  });

  function isProductNew(createdAt) {
    const createdDate = new Date(createdAt); // Convert the createdAt string to a Date object
    const currentDate = new Date(); // Get the current date
    const differenceInMillis = currentDate - createdDate; // Difference in milliseconds

    // Convert 1 day to milliseconds
    const oneDayInMillis = 24 * 60 * 60 * 1000;

    // Check if the difference is less than or equal to 1 day
    return differenceInMillis <= oneDayInMillis;
  }

  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".add-to-wishlist");
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

    const productId = button.getAttribute("data-id");
    console.log(productId);

    try {
      const response = await fetch(
        "https://african-store.onrender.com/api/v1/wishlist",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          Authorization: `Bearer ${token}`,
          body: JSON.stringify({ productId }),
        }
      );

      console.log(response);
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        button.classList.add("added"); // Indicate it's been added
        alert("Product added to wishlist!");
      } else {
        alert(data.message || "Failed to add product to wishlist.");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("An error occurred. Please try again.");
    }
  });

  function updatePagination(pagination) {
    paginationContainer.innerHTML = ""; // Clear old pagination

    // Previous Page Button
    if (pagination.hasPrevPage) {
      paginationContainer.innerHTML += `
            <li class="page-item">
              <a class="page-link" href="#" data-page="${
                pagination.currentPage - 1
              }">
                <i class="feather icon-feather-arrow-left fs-18 d-xs-none"></i>
              </a>
            </li>
          `;
    }

    // Page Numbers
    for (let i = 1; i <= pagination.totalPages; i++) {
      paginationContainer.innerHTML += `
            <li class="page-item ${
              pagination.currentPage === i ? "active" : ""
            }">
              <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
          `;
    }

    // Next Page Button
    if (pagination.hasNextPage) {
      paginationContainer.innerHTML += `
            <li class="page-item">
              <a class="page-link" href="#" data-page="${
                pagination.currentPage + 1
              }">
                <i class="feather icon-feather-arrow-right fs-18 d-xs-none"></i>
              </a>
            </li>
          `;
    }

    // Add click event to pagination links
    document.querySelectorAll(".pagination .page-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const newPage = parseInt(e.target.dataset.page);
        if (newPage) {
          currentPage = newPage;
          fetchProducts(currentPage);
        }
      });
    });
  }

  fetchProducts(currentPage);
});

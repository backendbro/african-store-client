document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  const productList = document.querySelector("#wishlist-list");
  if (!productList) {
    console.error("Product list container not found!");
    return;
  }

  if (!token) {
    Swal.fire({
      title: "Error",
      text: "Invalid credentials. You must be logged in to access this page",
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
    });
  }

  const style = document.createElement("style");
  style.innerHTML = `
    /* Hover effects for wishlist and quick-shop links */
    .add-to-wishlist:hover, .quick-shop:hover {
      transform: scale(1.1);
      background: #f0f0f0;
      transition: transform 0.2s ease;
    }

    /* Red background when wishlist is clicked */
.add-to-wishlist.added {
  background: red !important;
  color: #fff !important;
}

    
    /* Spinner styles for wishlist */
    .wishlist-spinner {
      display: inline-block;
      margin-left: 5px;
      width: 16px;
      height: 16px;
      border: 2px solid #3498db;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  const paginationContainer = document.querySelector(".pagination");
  let currentPage = 1;
  const limit = 10; // Adjust as needed
  const apiUrl = `https://african-store.onrender.com/api/v1/product`;

  async function fetchProducts(page) {
    console.log(apiUrl);
    try {
      const response = await fetch(
        `https://african-store.onrender.com/api/v1/wishlist?page=1&limit=10`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      console.log(result);
      if (result.success) {
        renderProducts(result, result);
        updatePagination(result.pagination);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  // Retrieve cart from localStorage or initialize an empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderProducts(products, results) {
    console.log(products);
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

    products.data.forEach((product) => {
      product = product.productId;
      console.log(product);
      let Discount = product.Discount
        ? product.BasePrice * (product.Discount / 100)
        : 0;
      let finalPrice = Math.round(product.BasePrice - Discount);
      let isNew = isProductNew(product.createdAt);

      const productItem = document.createElement("li");

      productItem.classList.add("product-item");

      // Product link including ID
      const productLink = `https://www.africanmarkets.eu/store/single%20product/single-product.html?id=${product._id}`;

      //   productItem.innerHTML = `
      //   <div class="product-box">
      //     <a href="${productLink}" class="product-link">
      //       <div class="product-image">
      //         <img src="${
      //           product.file[0] ||
      //           "https://i.pinimg.com/736x/1c/16/62/1c1662f546cc85a1d77732c840ff9113.jpg"
      //         }" alt="${product.name}">
      //         ${isNew ? `<span class="label">New</span>` : ""}
      //         <div class="product-overlay"></div>
      //         <div class="product-buttons">
      //       <button class="add-to-cart" data-id="${
      //         product._id
      //       }">Add to Cart</button>
      //     </div>
      //     <div class="product-actions">
      //                   <ul>
      //                     <li>
      //                       <button
      //                       data-id="${product._id}"
      //                         title="Add to wishlist"
      //                         id="add-to-wishlist"
      //                         class="add-to-wishlist"
      //                         >
      //                         <i class="feather icon-feather-heart fs-16"></i>
      //                       </button>
      //                     </li>
      //                     <li>
      //                       <a href="${productLink}" title="Quick shop">
      //                         <i class="feather icon-feather-eye fs-16"></i>
      //                       </a>
      //                     </li>
      //                   </ul>
      //                 </div>
      //         </div>
      //       <div class="product-info">
      //         <span class="product-name">${product.name}</span>
      //         <div class="product-price">
      //           ${product.Discount ? `<del>€${product.BasePrice}</del>` : ""}
      //           €${finalPrice}
      //         </div>
      //       </div>
      //     </a>
      //   </div>
      // `;

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
          <div class="product-buttons">
            <button class="add-to-cart"
            data-id="${product._id}" 
                        data-name="${product.name}" 
                        data-price="${finalPrice}" 
                        data-image="${product.file[0]}"
                        data-stock="${product.StockQuantity}">
            
              <i class="feather icon-feather-shopping-bag"></i>
              Add to Cart
            </button>
          </div>
          <div class="product-actions">
      <ul>
        <li>
          <a href="#" class="add-to-wishlist added"
          } w-40px h-40px bg-white text-dark-gray d-flex align-items-center justify-content-center rounded-circle ms-5px me-5px"
         "data-bs-placement="left" aria-label="Remove from wishlist"
          data-bs-original-title="Add to wishlist" data-id="${product._id}">
            <i class="feather icon-feather-heart-on fs-16 product-wishlist-icon"></i>
          </a>
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
          <div class="product-price">€${product.BasePrice}</div>
        </div>
      </div>
    `;
      productList.appendChild(productItem);
    });

    // Attach event listeners to "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", (event) => {
        console.log("Hello world");
        event.preventDefault();

        // Retrieve product attributes
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

        // Validate product attributes (Ensure they are not null or undefined)
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
            text: "Please try again.",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
          return; // Stop execution if product data is invalid
        }

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
        window.location.href = "/account.html";
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
          button.classList.add("added"); // Indicate it's been added

          Swal.fire({
            title: "Wishlist",
            text: data.message,
            icon: "success",
            showConfirmButton: false,
            timer: 2000, // Auto close in 2 seconds
          });
        } else if (data.message == "Removed from wishlist") {
          console.log(`FROM REMOVED: ${data.message}`);
          button.classList.remove("added");
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
          <li class="page-item ${pagination.currentPage === i ? "active" : ""}">
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

  window.onload = () => {
    fetchProducts(currentPage);
  };
});

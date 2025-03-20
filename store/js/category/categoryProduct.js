document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  console.log(productId);

  if (!productId) {
    console.error("Product ID not found in URL");
    return;
  }

  // Inject CSS for hover effects, clicked state, and spinner animation
  const style = document.createElement("style");
  style.innerHTML = `
    /* Hover effects for wishlist and quick-shop buttons */
    .add-to-wishlist:hover, .quick-shop:hover {
      transform: scale(1.1);
      transition: transform 0.2s ease;
    }

    /* Red background when wishlist is clicked */
.add-to-wishlist.added {
  background: red !important;
  color: #fff !important;
}


    /* Red background when wishlist is clicked */
    .add-to-wishlist.clicked {
      background: red !important;
      color: #fff !important;
    }
    /* Spinner styles for wishlist button */
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

  const productList = document.querySelector(".product-lister");
  console.log(productList);
  const paginationContainer = document.querySelector(".pagination");

  const limit = 5; // Adjust as needed
  const apiUrl = `https://african-store.onrender.com/api/v1/category/frontend/${productId}`;
  // NOTE: "productId" will be defined below from the URL

  async function fetchProducts(page) {
    console.log(apiUrl);
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      // Add Authorization header **only if token exists**
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: headers,
      });
      const result = await response.json();

      console.log(`This is it: ${result.data}`);
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
    console.log(products);
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

    // products.forEach((product) => {
    //   console.log(product);
    //   let Discount = product.Discount
    //     ? product.BasePrice * (product.Discount / 100)
    //     : 0;
    //   let finalPrice = Math.round(product.BasePrice - Discount);
    //   let isNew = isProductNew(product.createdAt);

    //   const productItem = document.createElement("li");
    //   productItem.classList.add("product-item");

    //   const productLink = `https://www.africanmarkets.eu/store/single%20product/single-product.html?id=${product._id}`;

    //   productItem.innerHTML = `
    //   <div class="product-box">
    //     <div class="product-image">
    //       <a href="${productLink}">
    //         <img src="${
    //           product.file[0] ||
    //           "https://i.pinimg.com/474x/68/cb/f4/68cbf40113d88a2a6a63b937740a292f.jpg"
    //         }" alt="${product.name}" />
    //         ${isNew ? '<span class="label">New</span>' : ""}
    //         <div class="product-overlay"></div>
    //       </a>
    //       <div class="product-buttons" style="cursor: pointer;">
    //         <a class="add-to-cart"
    //           data-id="${product._id}"
    //           data-name="${product.name}"
    //           data-price="${finalPrice}"
    //           data-image="${product.file[0]}"
    //           data-stock="${product.StockQuantity}">
    //           <i class="feather icon-feather-shopping-bag"></i>
    //           Add to Cart
    //         </a>
    //       </div>
    //       <div class="product-actions">
    //         <ul>
    //           <li>
    //             <a href="#" class="add-to-wishlist ${
    //               product.isWishlisted ? "added" : ""
    //             } d-flex align-items-center justify-content-center"
    //                data-bs-placement="left" aria-label="Remove from wishlist"
    //                data-bs-original-title="Add to wishlist" data-id="${
    //                  product._id
    //                }"
    //                style="width: 40px; height: 40px; background: #fff; color: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
    //               <i class="feather icon-feather-heart-on fs-16 product-wishlist-icon"></i>
    //             </a>
    //           </li>
    //           <li>
    //             <a href="${productLink}" title="Quick shop" class="quick-shop"
    //                style="width: 40px; height: 40px; background: #fff; color: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
    //               <i class="feather icon-feather-eye fs-16"></i>
    //             </a>
    //           </li>
    //         </ul>
    //       </div>
    //     </div>
    //     <div class="product-info">
    //       <a href="${productLink}" class="product-name">${product.name}</a>
    //       <div class="product-price">€${product.BasePrice}</div>
    //     </div>
    //   </div>
    //   `;
    //   productList.appendChild(productItem);
    // });

    WishlistService.fetchWishlist()
      .then((wishlist) => {
        // Now loop through your products array
        products.forEach((product) => {
          console.log(product);

          function calculateFinalPrice(basePrice, discount, discountType) {
            let finalPrice = basePrice;
            if (discountType === "Percentage") {
              finalPrice = basePrice - (basePrice * discount) / 100;
            } else if (discountType === "Fixed Amount") {
              finalPrice = basePrice - discount;
            }
            // Ensure final price is not negative
            return finalPrice > 0 ? finalPrice : 0;
          }

          const finalPrice = calculateFinalPrice(
            product.BasePrice,
            product.Discount,
            product.DiscountiscountType
          );

          let isNew = isProductNew(product.createdAt);

          // Check if the current product exists in the fetched wishlist
          let isWishlisted = wishlist.some((item) => item._id === product._id);

          // Determine if the product is out of stock
          let isOutOfStock = product.StockQuantity === 0;

          const productItem = document.createElement("li");
          productItem.classList.add("product-item");

          const productLink = `https://www.africanmarkets.eu/store/single%20product/single-product.html?id=${product._id}`;

          productItem.innerHTML = `
      <div class="product-box">
        <div class="product-image">
          <a href="${productLink}" ${
            isOutOfStock ? 'style="pointer-events: none; opacity: 0.5;"' : ""
          }>
            <img src="${
              product.file[0] ||
              "https://i.pinimg.com/474x/68/cb/f4/68cbf40113d88a2a6a63b937740a292f.jpg"
            }" alt="${product.name}" />
            ${isNew ? '<span class="label">New</span>' : ""}
            <div class="product-overlay"></div>
          </a>
          <div class="product-buttons" style="cursor: pointer;">
            <a class="add-to-cart"
               data-id="${product._id}" 
               data-name="${product.name}" 
               data-price="${finalPrice}" 
               data-image="${product.file[0]}"
               data-stock="${product.StockQuantity}"
               ${
                 isOutOfStock
                   ? 'style="pointer-events: none; opacity: 0.5;"'
                   : ""
               }>
              ${
                isOutOfStock
                  ? '<span style="background-color: white; color: red; font-size: 1.2em; padding: 5px 10px; border-radius: 3px;">Out of Stock</span>'
                  : '<i class="feather icon-feather-shopping-bag"></i> Add to Cart'
              }
            </a>
          </div>
          <div class="product-actions">
            <ul>
              <li>
                <a href="#" class="add-to-wishlist ' + (isWishlisted ? "added" : "") + ' d-flex align-items-center justify-content-center"
                   data-bs-placement="left" aria-label="Remove from wishlist"
                   data-bs-original-title="Add to wishlist" data-id="${
                     product._id
                   }"
                   style="width: 40px; height: 40px; background: #fff; color: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; ${
                     isOutOfStock ? "pointer-events: none; opacity: 0.5;" : ""
                   }">
                  <i class="feather icon-feather-heart-on fs-16 product-wishlist-icon"></i>
                </a>
              </li>
              <li>
                <a href="${productLink}" title="Quick shop" class="quick-shop"
                   style="width: 40px; height: 40px; background: #fff; color: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; ${
                     isOutOfStock ? "pointer-events: none; opacity: 0.5;" : ""
                   }">
                  <i class="feather icon-feather-eye fs-16"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="product-info">
          <a href="${productLink}" class="product-name" ${
            isOutOfStock ? 'style="pointer-events: none; opacity: 0.5;"' : ""
          }>${product.name}</a>
          <div class="product-price">
        ${
          product.Discount && product.Discount > 0
            ? `<del>€${product.BasePrice.toFixed(
                2
              )}</del> €${finalPrice.toFixed(2)}`
            : `€${product.BasePrice.toFixed(2)}`
        }
      </div>
        </div>
      </div>
    `;

          productList.appendChild(productItem);
        });

        function displayCartItems() {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];

          const cartItemList = document.querySelector(".cart-item-list");

          // Clear previous content before updating
          cartItemList.innerHTML = "";

          let totalPrice = 0; // Variable to store total cart price

          cart.forEach((item, index) => {
            totalPrice += item.quantity * item.finalPrice; // Calculate total

            const cartItem = document.createElement("li");
            cartItem.classList.add("cart-item", "align-items-center");

            cartItem.innerHTML = `
                <a href="javascript:void(0);" class="alt-font close" data-index="${index}">×</a>
                <div class="product-image">
                  <a href="demo-fashion-store-single-product.html">
                    <img src="${
                      item.image || "../../store/images/products/default.jpg"
                    }" class="cart-thumb" alt="${item.name}" />
                  </a>
                </div>
                <div class="product-detail fw-600">
                  <a href="demo-fashion-store-single-product.html">${
                    item.name
                  }</a>
                  <span class="item-ammount fw-400">${
                    item.quantity
                  } x €${item.finalPrice.toFixed(2)}</span>
                </div>
              `;

            cartItemList.appendChild(cartItem);
          });

          // Append subtotal and checkout links
          const cartTotal = document.createElement("li");
          cartTotal.classList.add("cart-total");
          cartTotal.innerHTML = `
              <div class="fs-18 alt-font mb-15px">
                <span class="w-50 fw-500 text-start">Subtotal:</span>
                <span class="w-50 text-end fw-700">€${totalPrice.toFixed(
                  2
                )}</span>
              </div>
              <a href="/cart.html" class="btn btn-large btn-transparent-light-gray border-color-extra-medium-gray">
                View cart
              </a>
              `;

          cartItemList.appendChild(cartTotal);

          // Attach event listeners to close buttons
        }

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
              return;
            }

            const productObject = {
              id: productId,
              name: productName,
              finalPrice: productPrice,
              image: productImage,
              StockQuantity: productStock,
              quantity: 1,
            };

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
              displayCartItems();
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
      })
      .catch((err) => {
        console.error("Failed to load wishlist:", err);
      });
  }

  // Primary wishlist event listener (with spinner, hover, and red background when clicked)
  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".add-to-wishlist");
    if (!button) return;
    event.preventDefault();

    // Create and show spinner inside the wishlist button
    const wishlistSpinner = document.createElement("span");
    wishlistSpinner.className = "wishlist-spinner";
    button.appendChild(wishlistSpinner);

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
      if (button.contains(wishlistSpinner)) {
        button.removeChild(wishlistSpinner);
      }
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
      const data = await response.json();
      if (button.contains(wishlistSpinner)) {
        button.removeChild(wishlistSpinner);
      }
      if (response.ok) {
        if (data.message == "Added to wishlist") {
          console.log(`FROM ADDED: ${data.message}`);
          button.classList.add("added"); // existing indication
          button.classList.add("clicked"); // add red background
          Swal.fire({
            title: "Wishlist",
            text: data.message,
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } else if (data.message == "Removed from wishlist") {
          console.log(`FROM REMOVED: ${data.message}`);
          button.classList.remove("added");
          button.classList.remove("clicked");
          Swal.fire({
            title: "Wishlist",
            text: "Removed from wishlist",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } else {
        Swal.fire({
          title: "Wishlist",
          text: data.message || "Failed to add product to wishlist.",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (button.contains(wishlistSpinner)) {
        button.removeChild(wishlistSpinner);
      }
      Swal.fire({
        title: "Wishlist",
        text: error.message || "Failed to add product to wishlist.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });

  // Remove duplicate wishlist event listener if present (only one is needed)

  function isProductNew(createdAt) {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const differenceInMillis = currentDate - createdDate;
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    return differenceInMillis <= oneDayInMillis;
  }

  function updatePagination(pagination) {
    paginationContainer.innerHTML = "";
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
    for (let i = 1; i <= pagination.totalPages; i++) {
      paginationContainer.innerHTML += `
        <li class="page-item ${pagination.currentPage === i ? "active" : ""}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }
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

  let currentPage = 1;
  fetchProducts(currentPage);
});

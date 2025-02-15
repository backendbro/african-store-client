document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  console.log(productId);

  if (!productId) {
    console.error("Product ID not found in URL");
    return;
  }

  // Inject CSS for hover effects and spinner animation
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

  const productList = document.querySelector(".liste");
  const paginationContainer = document.querySelector(".pagination");

  const limit = 4; // Adjust as needed
  const apiUrl = `https://african-store.onrender.com/api/v1/product/category?productId=${productId}`;

  async function fetchProducts() {
    console.log(apiUrl);
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      // Add Authorization header **only if token exists**
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}&limit=${limit}`, {
        method: "GET",
        headers: headers,
      });

      const result = await response.json();

      console.log(result);
      if (result.data.length !== 0) {
        renderProducts(result.data, result);
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

    //   // productItem.innerHTML = `
    //   // <div class="product-box">
    //   //   <div class="product-image">
    //   //     <a href="${productLink}">
    //   //       <img src="${
    //   //         product.file[0] ||
    //   //         "https://i.pinimg.com/474x/68/cb/f4/68cbf40113d88a2a6a63b937740a292f.jpg"
    //   //       }" alt="${product.name}" />
    //   //       ${isNew ? '<span class="label">New</span>' : ""}
    //   //       <div class="product-overlay"></div>
    //   //     </a>
    //   //     <div class="product-buttons" style="cursor: pointer;">
    //   //       <a class="add-to-cart"
    //   //         data-id="${product._id}"
    //   //         data-name="${product.name}"
    //   //         data-price="${finalPrice}"
    //   //         data-image="${product.file[0]}"
    //   //         data-stock="${product.StockQuantity}">
    //   //         <i class="feather icon-feather-shopping-bag"></i>
    //   //         Add to Cart
    //   //       </a>
    //   //     </div>
    //   //     <div class="product-actions">
    //   //       <ul>
    //   //         <li>
    //   //           <a href="#" class="add-to-wishlist ${
    //   //             product.isWishlisted ? "added" : ""
    //   //           } d-flex align-items-center justify-content-center"
    //   //              data-bs-placement="left" aria-label="Remove from wishlist"
    //   //              data-bs-original-title="Add to wishlist" data-id="${
    //   //                product._id
    //   //              }"
    //   //              style="width: 40px; height: 40px; background: #fff; color: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
    //   //             <i class="feather icon-feather-heart-on fs-16 product-wishlist-icon"></i>
    //   //           </a>
    //   //         </li>
    //   //         <li>
    //   //           <a href="${productLink}" title="Quick shop" class="quick-shop"
    //   //              style="width: 40px; height: 40px; background: #fff; color: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
    //   //             <i class="feather icon-feather-eye fs-16"></i>
    //   //           </a>
    //   //         </li>
    //   //       </ul>
    //   //     </div>
    //   //   </div>
    //   //   <div class="product-info">
    //   //     <a href="${productLink}" class="product-name">${product.name}</a>
    //   //     <div class="product-price">€${product.BasePrice}</div>
    //   //   </div>
    //   // </div>
    //   // `;

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
        ${isNew ? '<span class="label">New</span>' : ""}
        <div class="product-overlay"></div>
      </a>
      <div class="product-buttons" style="cursor: pointer;">
        <a class="add-to-cart"
           data-id="${product._id}" 
           data-name="${product.name}" 
           data-price="${finalPrice}" 
           data-image="${product.file[0]}"
           data-stock="${product.StockQuantity}">
          <i class="feather icon-feather-shopping-bag"></i>
          Add to Cart
        </a>
      </div>
      <div class="product-actions">
        <ul>
          <li>
            <a href="#" class="add-to-wishlist ${
              isWishlisted ? "added" : ""
            } d-flex align-items-center justify-content-center"
               data-bs-placement="left" aria-label="Remove from wishlist"
               data-bs-original-title="Add to wishlist" data-id="${product._id}"
               style="width: 40px; height: 40px; background: #fff; color: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <i class="feather icon-feather-heart-on fs-16 product-wishlist-icon"></i>
            </a>
          </li>
          <li>
            <a href="${productLink}" title="Quick shop" class="quick-shop"
               style="width: 40px; height: 40px; background: #fff; color: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <i class="feather icon-feather-eye fs-16"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="product-info">
      <a href="${productLink}" class="product-name">${product.name}</a>
      <div class="product-price">
    ${
      product.Discount && product.Discount > 0
        ? `<del>€${product.BasePrice.toFixed(2)}</del> €${finalPrice.toFixed(
            2
          )}`
        : `€${product.BasePrice.toFixed(2)}`
    }
  </div>
    </div>
  </div>
`;

          productList.appendChild(productItem);
        });
      })
      .catch((err) => {
        console.error("Failed to load wishlist:", err);
      });

    document.addEventListener("DOMContentLoaded", () => {
      const token = localStorage.getItem("token");

      // Inject CSS for hover effects and spinner animation
      const style = document.createElement("style");
      style.innerHTML = `
        /* Hover effects for wishlist and quick-shop links */
        .add-to-wishlist:hover, .quick-shop:hover {
          transform: scale(1.1);
          background: #f0f0f0;
          transition: transform 0.2s ease;
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

      const productList = document.querySelector("#lister");
      const paginationContainer = document.querySelector(".pagination");

      const limit = 4; // Adjust as needed
      const apiUrl = `https://african-store.onrender.com/api/v1/product/category?productId=679c77c2cc221bc159ce6c07`;

      async function fetchProducts() {
        console.log(apiUrl);
        try {
          const headers = {
            "Content-Type": "application/json",
          };

          // Add Authorization header **only if token exists**
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }

          const response = await fetch(`${apiUrl}&limit=${limit}`, {
            method: "GET",
            headers: headers,
          });

          const result = await response.json();

          console.log(result);
          if (result.data.length !== 0) {
            renderProducts(result.data, result);
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

        products.forEach((product) => {
          console.log(product);
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
                  data-stock="${product.StockQuantity}">
                  <i class="feather icon-feather-shopping-bag"></i>
                  Add to Cart
                </a>
              </div>
              <div class="product-actions">
                <ul>
                  <li>
                    <a href="#" class="add-to-wishlist ${
                      product.isWishlisted ? "added" : ""
                    } d-flex align-items-center justify-content-center"
                       data-bs-placement="left" aria-label="Remove from wishlist"
                       data-bs-original-title="Add to wishlist" data-id="${
                         product._id
                       }"
                       style="width: 40px; height: 40px; background: #fff; color: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <i class="feather icon-feather-heart-on fs-16 product-wishlist-icon"></i>
                    </a>
                  </li>
                  <li>
                    <a href="${productLink}" title="Quick shop" class="quick-shop"
                       style="width: 40px; height: 40px; background: #fff; color: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
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
            const productObject = {
              id: productId,
              name: productName,
              finalPrice: productPrice,
              image: productImage,
              StockQuantity: productStock,
              quantity: 1, // Initialize quantity as 1
            };
            console.log(productObject);

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
                text: "Invalid product data. Please try again.",
                icon: "error",
                showConfirmButton: false,
                timer: 2000,
              });
              return; // Stop execution if product data is invalid
            }

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

      // Wishlist event listener with spinner and hover effects are handled via CSS
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
          // Remove spinner if not logged in
          button.removeChild(wishlistSpinner);
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

          // Remove spinner once the request completes
          if (button.contains(wishlistSpinner)) {
            button.removeChild(wishlistSpinner);
          }

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
          if (button.contains(wishlistSpinner)) {
            button.removeChild(wishlistSpinner);
          }
          Swal.fire({
            title: "Wishlist",
            text: error.message || "Failed to add product to wishlist.",
            icon: "success",
            showConfirmButton: false,
            timer: 2000, // Auto close in 2 seconds
          });
        }
      });

      fetchProducts();
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
              <a href="demo-fashion-store-single-product.html">${item.name}</a>
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
            <span class="w-50 text-end fw-700">€${totalPrice.toFixed(2)}</span>
          </div>
          <a href="/cart.html" class="btn btn-large btn-transparent-light-gray border-color-extra-medium-gray">
            View cart
          </a>
          `;

      cartItemList.appendChild(cartTotal);

      // Attach event listeners to close buttons
      document.querySelectorAll(".close").forEach((button) => {
        button.addEventListener("click", (event) => {
          const index = event.target.getAttribute("data-index");
          removeCartItem(index);
        });
      });
    }

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
        const productObject = {
          id: productId,
          name: productName,
          finalPrice: productPrice,
          image: productImage,
          StockQuantity: productStock,
          quantity: 1, // Initialize quantity as 1
        };
        console.log(productObject);

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
            text: "Invalid product data. Please try again.",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
          return; // Stop execution if product data is invalid
        }

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
          displayCartItems();
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

  // Wishlist event listener with spinner and hover effects are handled via CSS
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
      // Remove spinner if not logged in
      button.removeChild(wishlistSpinner);
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

      // Remove spinner once the request completes
      if (button.contains(wishlistSpinner)) {
        button.removeChild(wishlistSpinner);
      }

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
      if (button.contains(wishlistSpinner)) {
        button.removeChild(wishlistSpinner);
      }
      Swal.fire({
        title: "Wishlist",
        text: error.message || "Failed to add product to wishlist.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000, // Auto close in 2 seconds
      });
    }
  });

  fetchProducts();
});

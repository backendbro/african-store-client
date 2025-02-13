document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.querySelector(".best-list");
  const API_URL = "https://african-store.onrender.com/api/v1/bestseller/";
  const AUTH_TOKEN = localStorage.getItem("token");

  try {
    async function fetchBestSellers() {
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        // Add Authorization header **only if token exists**
        if (AUTH_TOKEN) {
          headers["Authorization"] = `Bearer ${AUTH_TOKEN}`;
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const products = await response.json();
        console.log("Full API Response:", products);

        if (!products.data || products.data.length === 0) {
          return;
        }

        renderProducts(products.data);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        return;
      }
    }

    function renderProducts(products) {
      productList.innerHTML = ""; // Clear previous content

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
        const individualProduct = product.productId;

        if (!individualProduct) return;

        let Discount = individualProduct.Discount
          ? individualProduct.BasePrice * (individualProduct.Discount / 100)
          : 0;
        let finalPrice = Math.round(individualProduct.BasePrice - Discount);

        const productItem = document.createElement("li");
        productItem.classList.add("product-item");

        const productLink = `https://www.africanmarkets.eu/store/single%20product/single-product.html?id=${individualProduct._id}`;

        productItem.innerHTML = `
              <div class="product-box">
                <a href="${productLink}" class="product-link">
                  <div class="product-image">
                    <img src="${
                      individualProduct.file?.[0] ||
                      "https://i.pinimg.com/736x/1c/16/62/1c1662f546cc85a1d77732c840ff9113.jpg"
                    }" 
                         alt="${individualProduct.name}">
                    
                    <div class="product-overlay"></div>
                  
                    <div class="product-buttons">
                  <button class="add-to-cart" 
                          data-id="${individualProduct._id}" 
                          data-name="${individualProduct.name}" 
                          data-price="${finalPrice}" 
                          data-image="${individualProduct.file?.[0]}"
                          data-stock="${individualProduct.StockQuantity}">
                    Add to Cart
                  </button>
                </div>
                    </div>
                  <div class="product-info">
                    <span class="product-name">${individualProduct.name}</span>
                    <div class="product-price">
                      ${
                        individualProduct.Discount
                          ? `<del>€${individualProduct.BasePrice}</del>`
                          : ""
                      }
                      €${finalPrice}
                    </div>
                  </div>
                </a>
              </div>
            `;

        productList.append(productItem);
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

    fetchBestSellers();
  } catch (error) {
    console.log("Error message: " + error);
    return;
  }
});

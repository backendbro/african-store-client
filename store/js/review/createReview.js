document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    console.error("Product ID not found in URL");
    return;
  }

  const AUTH_TOKEN = localStorage.getItem("token");
  let clickedReviewsCount = 0;

  document.querySelectorAll(".star").forEach((star) => {
    star.addEventListener("click", function () {
      let value = parseInt(this.getAttribute("data-value"));
      let currentRating =
        parseInt(document.getElementById("ratingInput").value) || 0;

      // If the clicked star is the same as the current rating, clear the selection
      if (value === currentRating) {
        document.getElementById("ratingInput").value = "";
        document
          .querySelectorAll(".star")
          .forEach((s) => s.classList.remove("selected"));
        return;
      }

      // Otherwise, update the rating and highlight stars
      document.getElementById("ratingInput").value = value;
      document.querySelectorAll(".star").forEach((s, index) => {
        s.classList.toggle("selected", index < value);
      });
    });
  });

  // Handle form submission
  document
    .querySelector("#submit-review")
    .addEventListener("click", async (e) => {
      if (!AUTH_TOKEN) {
        Swal.fire({
          title: "Review",
          text: "To continue this action you have to log in",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }

      console.log("clicked");
      e.preventDefault();

      // Dynamically create and show the spinner
      let spinner = document.querySelector(".loading-spinner");
      const submitBtn = document.getElementById("submit-review");
      if (!spinner) {
        spinner = document.createElement("span");
        spinner.className = "loading-spinner";
        // Optional: add inline styles if needed (or define them in your CSS)
        spinner.style.display = "inline-block";
        spinner.style.marginLeft = "10px";
        submitBtn.appendChild(spinner);
      } else {
        spinner.style.display = "inline-block";
      }

      const name = document.querySelector("input[name='name']").value;
      const email = document.querySelector("input[name='email']").value;
      const rating = 5; // Update this based on selection
      const comment = document.querySelector("textarea[name='comment']").value;

      let termsAccepted;
      const termsCheckbox = document.querySelector(
        "input[name='terms_condition']"
      );
      if (!termsCheckbox) {
        console.error("Terms and conditions checkbox not found!");
      } else {
        termsAccepted = termsCheckbox.checked;
      }

      const clickedReviews = document.getElementById("ratingInput").value;

      // Use logical OR (||) not bitwise (|) for checking emptiness
      if (!name || !email || !clickedReviews || !comment || !termsAccepted) {
        Swal.fire({
          title: "Review",
          text: "Make sure to fill out all the fields to add a review",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        spinner.style.display = "none"; // Hide spinner since validation failed
        return;
      }

      try {
        const response = await fetch(
          `https://african-store.onrender.com/api/v1/review`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
            body: JSON.stringify({
              productId,
              name,
              email,
              rating: clickedReviews,
              comment,
              termsAccepted,
            }),
          }
        );
        console.log(response);
        const res = await response.json();
        if (response.ok) {
          spinner.style.display = "none";
          Swal.fire({
            title: "Review",
            text: "Review added",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          window.location.reload();
        } else if (
          res.message == "You can only submit up to 2 reviews per product."
        ) {
          spinner.style.display = "none";
          Swal.fire({
            title: "Review",
            text: res.message,
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Review",
          text: error.message,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        spinner.style.display = "none";
      } finally {
        // Hide spinner once the request is complete
        spinner.style.display = "none";
      }
    });
});

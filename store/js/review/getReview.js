document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const PRODUCT_ID = urlParams.get("id");

  if (!PRODUCT_ID) {
    console.error("Product ID not found in URL");
    return;
  }

  const token = localStorage.getItem("token");

  const API_URL = `https://african-store.onrender.com/api/v1/review/${PRODUCT_ID}`;

  let cursor = null; // Cursor for pagination
  let hasMore = true; // Flag to track if more reviews exist
  let allReviews = []; // Store all reviews to allow toggling
  let isExpanded = false; // Track toggle state
  let reviewLength = "";

  async function fetchReviews() {
    if (!hasMore) return;

    try {
      let url = `${API_URL}?limit=1`;
      if (cursor) url += `&cursor=${cursor}`;

      const headers = {
        "Content-Type": "application/json",
      };

      // Add Authorization header **only if token exists**
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      const {
        reviews,
        hasMore: newHasMore,
        totalReviews,
      } = await response.json();

      reviewLength = totalReviews;
      if (reviews.length > 0) {
        cursor = reviews[reviews.length - 1]._id;
      }

      hasMore = newHasMore;
      allReviews = [...allReviews, ...reviews]; // Append new reviews

      renderReviews();
      calculateAverageRating(allReviews);
      updateReviewStats(allReviews);

      // Hide button if no more reviews
      showMoreElement.style.display = hasMore ? "block" : "none";
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  const sub = "review-star-count";

  const reviewsContainer = document.getElementById("reviews");
  reviewsContainer.innerHTML = "";

  function renderReviews() {
    reviewsContainer.innerHTML = ""; // Clear container before re-rendering
    document.querySelector("#review-count-text").textContent = reviewLength;
    document.querySelector(".review-count-text").textContent = reviewLength;

    allReviews.forEach((review) => {
      const date = formatDate(review.createdAt);
      const reviewElement = document.createElement("div");
      reviewElement.classList.add("col-12", "border-bottom", "pb-40px");
      reviewElement.style.margin = "20px 0"; // Add spacing between reviews

      reviewElement.innerHTML = `
            <div class="d-block d-md-flex w-100 align-items-center mb-3">
              <div class="w-300px md-w-250px sm-w-100 text-center">
               <img class="rounded-circle w-90px mb-10px" alt="" src="${
                 review.avatar ||
                 "https://i.pinimg.com/474x/82/73/46/827346ec925e4ecfc40184bc035d3955.jpg"
               }">
                <span class="text-dark-gray fw-600 d-block">${
                  review.name
                }</span>
                <div class="fs-14 lh-18">${date}</div>
              </div>
    
              <div class="d-none d-md-block border-start border-gray-500 h-300 mx-3"></div>
    
              <div class="w-100 text-center text-md-start">
                <span class="text-golden-yellow">
                  ${'<i class="bi bi-star-fill"></i>'.repeat(review.rating)}
                  ${'<i class="bi bi-star"></i>'.repeat(5 - review.rating)}
                </span>
                <p>${review.comment}</p>
              </div>
            </div>
          `;

      reviewsContainer.appendChild(reviewElement);
    });

    // Ensure "Show More Reviews" is at the bottom
    reviewsContainer.appendChild(showMoreElement);
  }

  // Show More Button
  const showMoreElement = document.createElement("div");
  showMoreElement.id = "show-more-btn";
  showMoreElement.classList.add(
    "col-12",
    "last-paragraph-no-margin",
    "text-center"
  );
  showMoreElement.innerHTML = `
        <a href="#reviews" class="btn btn-link btn-hover-animation-switch btn-extra-large text-dark-gray">
          <span>
            <span class="btn-text">Show more reviews</span>
            <span class="btn-icon"><i class="fa-solid fa-chevron-down"></i></span>
            <span class="btn-icon"><i class="fa-solid fa-chevron-down"></i></span>
          </span>
        </a>
      `;

  // Toggle Reviews
  showMoreElement.addEventListener("click", () => {
    if (isExpanded) {
      // Collapse reviews: reset state
      allReviews = [];
      cursor = null;
      hasMore = true;
      fetchReviews(); // Fetch first batch again
      showMoreElement.querySelector(".btn-text").textContent =
        "Show more reviews";
    } else {
      fetchReviews();
      showMoreElement.querySelector(".btn-text").textContent =
        "Show less reviews";
    }
    isExpanded = !isExpanded;
  });

  reviewsContainer.appendChild(showMoreElement);

  function likeReview(reviewId) {
    const likesElement = document.getElementById(`likes-${reviewId}`);
    let currentLikes = parseInt(likesElement.textContent);
    likesElement.textContent = currentLikes + 1;
  }

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) {
      return "Invalid Date"; // Handle invalid dates
    }

    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  const calculateAverageRating = (reviews) => {
    console.log(reviews.length);
    if (!reviews.length) {
      return { average: 0, stars: "☆☆☆☆☆" }; // No reviews
    }

    document.querySelector(
      ".total-reviews-count"
    ).textContent = `${reviews.length} reviews`;
    document.querySelector(
      ".total-review-bracket"
    ).textContent = `Review(${reviews.length})`;

    // Calculate total average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / reviews.length;

    // Round to nearest integer for stars
    const roundedAverage = Math.round(average);

    // Generate stars (e.g., ⭐⭐⭐☆☆ for 3)
    const stars = "⭐".repeat(roundedAverage) + "☆".repeat(5 - roundedAverage);

    document.querySelector(".average-review").textContent = parseFloat(
      average.toFixed(1)
    );
    document.querySelector(
      ".review-star-count"
    ).innerHTML = `<span> ${stars} </span>`;

    console.log({ average: parseFloat(average.toFixed(1)), stars });
    return { average: parseFloat(average.toFixed(1)), stars };
  };

  calculateAverageRating;
  updateReviewStats;

  function updateReviewStats(reviews) {
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // Count occurrences of each rating
    reviews.forEach((review) => {
      ratingCounts[review.rating]++;
    });

    const totalReviews = reviews.length;
    const percentages = Object.keys(ratingCounts)
      .map((star) => ({
        star: parseInt(star),
        percent: totalReviews
          ? ((ratingCounts[star] / totalReviews) * 100).toFixed(2)
          : 0,
      }))
      .reverse();

    // Update progress bars and percentage labels
    percentages.forEach(({ star, percent }) => {
      document.getElementById(`progress-${star}`).style.width = `${percent}%`;
      document.getElementById(`percent-${star}`).innerText = `${percent}%`;
    });
  }

  // Fetch first batch of reviews
  fetchReviews();
});

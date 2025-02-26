document.addEventListener("DOMContentLoaded", () => {
  const imageUpload = document.getElementById("imageUpload");
  const token = localStorage.getItem("token");
  const profileImgContainer = document.querySelector(".profile-img-container");

  async function uploadImage(event) {
    const file = event.target.files[0];
    if (!file) {
      Swal.fire({
        title: "File upload",
        text: "No file selected.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000, // Auto close in 2 seconds
      });
      console.warn("No file selected.");
      return;
    }

    // Create and display the spinner overlay
    const spinnerOverlay = document.createElement("div");
    spinnerOverlay.classList.add("spinner-overlay");
    spinnerOverlay.innerHTML = `<div class="spinner"></div>`;
    profileImgContainer.appendChild(spinnerOverlay);

    // Prepare the FormData with the file
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      // Send a PUT request to update the profile picture (do not set Content-Type header)
      const response = await fetch(
        "https://african-store.onrender.com/api/v1/auth/user/profile-picture",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        console.error("Failed to update profile picture", response.statusText);
        profileImgContainer.removeChild(spinnerOverlay);
        return;
      }

      // Parse the JSON response
      const data = await response.json();
      console.log("Profile picture updated:", data);

      // If a new profile picture URL is returned, update the image src
      if (data.data && data.data.profilePicture) {
        document.getElementById("profile-img-display").src =
          data.data.profilePicture;
      }
    } catch (err) {
      console.error("Error uploading profile picture:", err);
    } finally {
      // Remove the spinner overlay whether the upload was successful or not
      if (profileImgContainer.contains(spinnerOverlay)) {
        profileImgContainer.removeChild(spinnerOverlay);
      }
    }
  }

  imageUpload.addEventListener("change", uploadImage);
});

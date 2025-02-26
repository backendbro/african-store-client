document.addEventListener("DOMContentLoaded", async function () {
  async function getUserDetails() {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        title: "Not authenticated",
        text: "Please log in to view your profile",
        icon: "error",
        showConfirmButton: false,
        timer: 2000, // Auto close in 2 seconds
      });
      window.location.href = "/account.html";
      return null;
    }

    try {
      const response = await fetch(
        "https://african-store.onrender.com/api/v1/auth/me",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        Swal.fire({
          title: "Not authenticated",
          text: "Could not get user profile",
          icon: "success",
          showConfirmButton: false,
          timer: 2000, // Auto close in 2 seconds
        });
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const userData = await response.json();
      document.getElementById("user-name").innerHTML = `
      ${userData.user.username} &nbsp;
            <button onclick="showEditPopup()">Edit ✏️</button>`;
      document.getElementById("user-email").textContent = userData.user.email;

      const profileImg = document.getElementById("profile-img-display");
      const defaultProfilePic =
        "https://i.pinimg.com/236x/5e/39/6b/5e396bb1b17681759922dd10f8a9d702.jpg";

      if (profileImg) {
        profileImg.src = userData.user.profilePicture
          ? userData.user.profilePicture
          : defaultProfilePic;
      }

      console.log(profileImg.src);

      console.log(userData);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      return null;
    }
  }

  // Fetch user details after DOM has loaded
  const user = await getUserDetails();
  if (user) {
    console.log("User Details:", user);
    // Example: Update UI with user's name
    const accountText = document.querySelector(".header-account a span");
    if (accountText) {
      accountText.textContent = user.name || "My Profile";
    }
  }
});

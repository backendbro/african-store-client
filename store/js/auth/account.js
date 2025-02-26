document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const accountDropdown = document.querySelector(".account-item-list");
  const loginItem = accountDropdown.querySelector(".account-item:nth-child(2)");
  const profileItem = accountDropdown.querySelector(
    ".account-item:nth-child(1)"
  );
  const logoutItem = accountDropdown.querySelector(
    ".account-item:nth-child(3)"
  );

  if (token) {
    console.log("visible");
    // Show profile and logout, hide login
    profileItem.style.display = "block";
    logoutItem.style.display = "block";
    loginItem.style.display = "none";

    logoutItem.addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("token");

      Swal.fire({
        title: "Logged Out!",
        text: "You have successfully logged out.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000, // Auto close in 2 seconds
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  } else {
    // Show login, hide profile and logout
    profileItem.style.display = "none";
    logoutItem.style.display = "none";
    loginItem.style.display = "block";
  }
});

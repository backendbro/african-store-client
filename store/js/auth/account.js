document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  console.log(token);
  const accountText = document.querySelector(".account-auth span");
  const accountLink = document.querySelector(".account-auth");

  if (token && accountText && accountText.textContent.trim() === "Account") {
    accountText.textContent = "Logout";
    if (accountLink) {
      accountLink.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Something happened");
        localStorage.removeItem("token");

        Swal.fire({
          title: "Logged Out!",
          text: "You have successfully logged out.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000, // Auto close in 2 seconds
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    }
  }
});

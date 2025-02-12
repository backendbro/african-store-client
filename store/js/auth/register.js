const registerButton = document.getElementById("registerButton");

registerButton.addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = { username, email, password };

  // Disable button and show spinner
  registerButton.disabled = true;
  registerButton.innerHTML = `<span class="spinner"></span> Registering...`;

  try {
    const response = await fetch(
      "https://african-store.onrender.com/api/v1/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("token", result.token);

      document.getElementById("username").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";

      Swal.fire({
        title: "Register successful",
        text: "You have successfully registered.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });

      window.location.href = "/index.html";
    } else {
      const error = await response.json();
      Swal.fire({
        title: "Register failed",
        text: error.message,
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  } catch (err) {
    Swal.fire({
      title: "Register failed",
      text: err.message,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
    });
  } finally {
    // Revert button to original state
    registerButton.disabled = false;
    registerButton.innerHTML = "Register";
  }
});

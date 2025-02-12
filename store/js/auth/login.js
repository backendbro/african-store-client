const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async () => {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const data = { usernameOrEmail: username, password };

  // Disable button and show spinner
  loginButton.disabled = true;
  loginButton.innerHTML = `<span class="spinner"></span> Logining in...`;

  try {
    // Send the POST request to the API
    const response = await fetch(
      "https://african-store.onrender.com/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    // Handle the response
    if (response.ok) {
      const result = await response.json();

      localStorage.setItem("token", result.token);

      document.getElementById("loginUsername").value = "";
      document.getElementById("loginPassword").value = "";

      Swal.fire({
        title: "Logged in",
        text: "You have successfully logged in.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });

      window.location.href = "/index.html";
    } else {
      const error = await response.json();
      Swal.fire({
        title: "Login Failed",
        text: error.message,
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  } catch (err) {
    Swal.fire({
      title: "Login failed",
      text: err.message,
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    });
  } finally {
    // Revert button to original state
    loginButton.disabled = false;
    loginButton.innerHTML = "Login";
  }
});

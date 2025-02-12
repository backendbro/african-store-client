document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  console.log(productId);

  if (!productId) {
    Swal.fire({
      title: "Checkout",
      text: "Please click on an item.",
      icon: "error",
      showConfirmButton: false,
      timer: 2000, // Auto close in 2 seconds
    });
    return;
  }

  const products = localStorage.getItem("paymentItem");
  const productItems = JSON.parse(products);
  console.log({ items: [productItems] });

  if (!productItems) {
    Swal.fire({
      title: "Checkout",
      text: "No item selected.",
      icon: "error",
      showConfirmButton: false,
      timer: 2000, // Auto close in 2 seconds
    });
  }

  const stripe = Stripe(
    "pk_live_51QkSW0E0IAd5uSo1ZLavGYaBNCqzCBfu4ScIeVbBo4ps78zNyZKIrcDAE9XaQlibo4IRrDI79ZCP0uG4QRQahgZv00F8oX6nmK"
  );

  const checkoutButton = document.querySelector("#checkout-button");

  checkoutButton.addEventListener("click", async () => {
    console.log("click");
    console.log(productItems);
    console.log("clicked");
    try {
      const response = await fetch(
        "https://african-store.onrender.com/api/v1/payment/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [productItems] }),
        }
      );

      console.log(response);
      const { id } = await response.json();
      console.log(id);
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (err) {
      console.error(err);
      alert("Payment failed - please try again");
    }
  });
});

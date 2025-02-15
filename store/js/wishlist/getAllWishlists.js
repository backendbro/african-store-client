// const token = localStorage.getItem("token");
// if (!token) {
//   console.log("NOT LOGGED IN");
//   // Optionally, you can skip the rest of the code:
// } else {
//   console.log("ELSE");
//   // wishlistService.js
//   var WishlistService = (function () {
//     var wishlist = null;
//     var isFetching = false;
//     var subscribers = [];

//     // Optionally load from localStorage for persistence
//     function initFromLocalStorage() {
//       var stored = localStorage.getItem("wishlist");
//       if (stored) {
//         try {
//           wishlist = JSON.parse(stored);
//         } catch (e) {
//           console.error("Error parsing wishlist from localStorage:", e);
//         }
//       }
//     }

//     initFromLocalStorage();

//     function fetchWishlist() {
//       console.log("hello fetching");
//       // Return cached wishlist if available
//       if (wishlist) return Promise.resolve(wishlist);

//       // If a fetch is already underway, wait for it to finish
//       if (isFetching) {
//         return new Promise(function (resolve) {
//           subscribers.push(resolve);
//         });
//       }

//       isFetching = true;
//       return fetch(
//         "https://african-store.onrender.com/api/v1/wishlist/user-wish",
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )
//         .then(function (response) {
//           return response.json();
//         })
//         .then(function (result) {
//           wishlist = result.data || [];
//           localStorage.setItem("wishlist", JSON.stringify(wishlist));
//           // Notify waiting subscribers
//           subscribers.forEach(function (cb) {
//             cb(wishlist);
//           });
//           subscribers = [];
//           return wishlist;
//         })
//         .catch(function (error) {
//           console.error("Error fetching wishlist:", error);
//           throw error;
//         })
//         .finally(function () {
//           isFetching = false;
//         });
//     }

//     // Allow updating the wishlist (for example, after adding/removing an item)
//     function updateWishlist(newWishlist) {
//       wishlist = newWishlist;
//       localStorage.setItem("wishlist", JSON.stringify(wishlist));
//       subscribers.forEach(function (cb) {
//         cb(wishlist);
//       });
//     }

//     return {
//       fetchWishlist: fetchWishlist,
//       getWishlist: function () {
//         return wishlist;
//       },
//       updateWishlist: updateWishlist,
//     };
//   })();
// }

const token = localStorage.getItem("token");
let WishlistService;

if (!token) {
  console.log("NOT LOGGED IN");
  // Dummy service that returns an empty wishlist
  WishlistService = {
    fetchWishlist: () => Promise.resolve([]),
    getWishlist: () => [],
    updateWishlist: (newWishlist) => {
      // No operation needed when not logged in
    },
  };
} else {
  console.log("ELSE");
  // Actual wishlist service when a token is available
  WishlistService = (function () {
    var wishlist = null;
    var isFetching = false;
    var subscribers = [];

    // Optionally load from localStorage for persistence
    function initFromLocalStorage() {
      var stored = localStorage.getItem("wishlist");
      if (stored) {
        try {
          wishlist = JSON.parse(stored);
        } catch (e) {
          console.error("Error parsing wishlist from localStorage:", e);
        }
      }
    }

    initFromLocalStorage();

    function fetchWishlist() {
      console.log("hello fetching");
      // Return cached wishlist if available
      if (wishlist) return Promise.resolve(wishlist);

      // If a fetch is already underway, wait for it to finish
      if (isFetching) {
        return new Promise(function (resolve) {
          subscribers.push(resolve);
        });
      }

      isFetching = true;
      return fetch(
        "https://african-store.onrender.com/api/v1/wishlist/user-wish",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          wishlist = result.data || [];
          localStorage.setItem("wishlist", JSON.stringify(wishlist));
          // Notify waiting subscribers
          subscribers.forEach(function (cb) {
            cb(wishlist);
          });
          subscribers = [];
          return wishlist;
        })
        .catch(function (error) {
          console.error("Error fetching wishlist:", error);
          throw error;
        })
        .finally(function () {
          isFetching = false;
        });
    }

    function updateWishlist(newWishlist) {
      wishlist = newWishlist;
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      subscribers.forEach(function (cb) {
        cb(wishlist);
      });
    }

    return {
      fetchWishlist: fetchWishlist,
      getWishlist: function () {
        return wishlist;
      },
      updateWishlist: updateWishlist,
    };
  })();
}

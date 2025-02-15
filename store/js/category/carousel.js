// // JavaScript Implementation
// function initializeProductSlider(productsArray) {
//   const sliderWrapper = document.querySelector('.product-horizontal-slider .swiper-wrapper');
//   sliderWrapper.innerHTML = ''; // Clear existing content

//   // Generate slides from products array
//   const slidesHTML = productsArray.map(product => `
//       <div class="swiper-slide">
//           <div class="interactive-banner-style-09 border-radius-6px overflow-hidden position-relative">
//               <img src="${product.image}" alt="${product.name}" />
//               <div class="opacity-full bg-gradient-gray-light-dark-transparent"></div>
//               <div class="image-content h-100 w-100 ps-15 pe-15 pt-11 pb-11 lg-p-11 d-flex justify-content-bottom align-items-start flex-column">
//                   <div class="mt-auto d-flex align-items-start w-100 z-index-1 position-relative overflow-hidden flex-column">
//                       <span class="text-white fw-500 fs-22">${product.name}</span>
//                       ${product.price ? `<span class="text-white fs-18 mt-1">€${product.price}</span>` : ''}
//                   </div>
//                   <div class="position-absolute left-0px top-0px w-100 h-100 bg-gradient-regal-blue-transparent opacity-9"></div>
//                   <div class="box-overlay bg-gradient-gray-light-dark-transparent"></div>
//                   <a href="${product.link || '#'}" class="position-absolute z-index-1 top-0px left-0px h-100 w-100"></a>
//               </div>
//           </div>
//       </div>
//   `).join('');

//   sliderWrapper.innerHTML = slidesHTML;

//   // Initialize Swiper
//   new Swiper('.product-horizontal-slider', {
//       slidesPerView: 1,
//       spaceBetween: 30,
//       loop: true,
//       autoplay: {
//           delay: 4000,
//           disableOnInteraction: false
//       },
//       navigation: {
//           nextEl: '.slider-one-slide-next-1',
//           prevEl: '.slider-one-slide-prev-1'
//       },
//       pagination: {
//           el: '.slider-four-slide-pagination-1',
//           clickable: true,
//           dynamicBullets: false
//       },
//       keyboard: {
//           enabled: true,
//           onlyInViewport: true
//       },
//       breakpoints: {
//           1400: { slidesPerView: 4 },
//           1024: { slidesPerView: 3 },
//           768: { slidesPerView: 3 },
//           576: { slidesPerView: 2 },
//           320: { slidesPerView: 1 }
//       },
//       effect: "slide"
//   });
// }

// // Example Usage
// const sampleProducts = [
//   {
//       name: "African Net Sponge 40 Inch",
//       image: "./store/images/sponge.webp",
//       price: 24.99,
//       link: "/products/sponge"
//   },
//   {
//       name: "Shea Butter",
//       image: "./store/images/shea-butter.jpg",
//       price: 19.99,
//       link: "/products/shea-butter"
//   },
//   // Add more products as needed
// ];

// // Initialize slider with products array
// document.addEventListener('DOMContentLoaded', () => {
//   initializeProductSlider(sampleProducts);
// });

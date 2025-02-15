const initProductSliders = (productData) => {
  const swiperWrapperMain = document.querySelector(
    ".product-image-slider .swiper-wrapper"
  );
  const swiperWrapperThumb = document.querySelector(
    ".product-image-thumb .swiper-wrapper"
  );

  if (!swiperWrapperMain || !swiperWrapperThumb || !productData?.data?.file)
    return;

  // Clear existing slides
  swiperWrapperMain.innerHTML = "";
  swiperWrapperThumb.innerHTML = "";

  const slidesMain = productData.data.file
    .map((file, index) => {
      const imgAlt = productData.data.name || `Product Image ${index + 1}`;
      return `
        <div class="swiper-slide gallery-box" role="group" aria-label="${
          index + 1
        } / ${productData.data.file.length}">
          <a href="${file}" data-group="lightbox-gallery" title="${imgAlt}">
            <img class="w-100" alt="${imgAlt}" src="${file}" data-no-retina="">
          </a>
        </div>`;
    })
    .join("");

  const slidesThumb = productData.data.file
    .map((file, index) => {
      const imgAlt = productData.data.name || `Product Image ${index + 1}`;
      return `
        <div class="swiper-slide" role="group" aria-label="${index + 1} / ${
        productData.data.file.length
      }" style="margin-bottom: 15px;">
          <img class="w-100" alt="${imgAlt}" src="${file}" data-no-retina="">
        </div>`;
    })
    .join("");

  // Insert slides into the DOM
  swiperWrapperMain.innerHTML = slidesMain;
  swiperWrapperThumb.innerHTML = slidesThumb;

  // Reinitialize Swiper
  setTimeout(() => {
    if (typeof Swiper !== "undefined") {
      const thumbSwiper = new Swiper(".product-image-thumb", {
        spaceBetween: 15,
        slidesPerView: "auto",
        direction: "vertical",
        navigation: {
          nextEl: ".swiper-thumb-next",
          prevEl: ".swiper-thumb-prev",
        },
      });

      new Swiper(".product-image-slider", {
        spaceBetween: 10,
        loop: productData.data.file.length > 1,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: ".slider-product-next",
          prevEl: ".slider-product-prev",
        },
        thumbs: { swiper: thumbSwiper },
      });
    }
  }, 100);
};

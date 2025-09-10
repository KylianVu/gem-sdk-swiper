export default function slideToLoop(index = 0, speed, runCallbacks = true, internal) {
  if (typeof index === 'string') {
    const indexAsNumber = parseInt(index, 10);

    index = indexAsNumber;
  }
  const swiper = this;
  if (swiper.destroyed) return;

  if (typeof speed === 'undefined') {
    speed = swiper.params.speed;
  }

  let newIndex = index;
  if (swiper.params.loop) {
    const slidesInDom = swiper.slides;
    const totalSlides = swiper.slides.length;

    let targetSlideIndex;
    targetSlideIndex = swiper.getSlideIndexByData(newIndex);

    const cols = swiper.slides.length;

    const { centeredSlides } = swiper.params;
    let slidesPerView = swiper.params.slidesPerView;
    if (slidesPerView === 'auto') {
      slidesPerView = swiper.slidesPerViewDynamic();
    } else {
      slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
      if (centeredSlides && slidesPerView % 2 === 0) {
        slidesPerView = slidesPerView + 1;
      }
    }
    let needLoopFix = cols - targetSlideIndex < slidesPerView;

    if (centeredSlides) {
      needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
    }
    if (internal && centeredSlides && swiper.params.slidesPerView !== 'auto') {
      needLoopFix = false;
    }

    if (needLoopFix) {
      let direction;
      let nextSteps;
      let prevSteps;
      if (swiper.activeIndex < targetSlideIndex) {
        nextSteps = targetSlideIndex - swiper.activeIndex;
        prevSteps = swiper.activeIndex - (targetSlideIndex - totalSlides);
      } else {
        prevSteps = swiper.activeIndex - targetSlideIndex;
        nextSteps = targetSlideIndex + totalSlides - swiper.activeIndex;
      }

      direction = nextSteps > prevSteps ? 'prev' : 'next';
      // const direction = centeredSlides
      //   ? targetSlideIndex < swiper.activeIndex
      //     ? 'prev'
      //     : 'next'
      //   : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView
      //   ? 'next'
      //   : 'prev';

      swiper.loopFixDot({
        direction,
        slideTo: true,
        activeSlideIndex: direction === 'next' ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
        slideRealIndex: direction === 'next' ? swiper.realIndex : undefined,
        targetSlideIndex,
        newIndex: swiper.getSlideIndexByData(newIndex),
      });
    }
    return;
    newIndex = swiper.getSlideIndexByData(newIndex);
    console.log('newIndex', newIndex);
  }

  requestAnimationFrame(() => {
    swiper.slideTo(newIndex, speed, runCallbacks, internal);
  });
  return swiper;
}

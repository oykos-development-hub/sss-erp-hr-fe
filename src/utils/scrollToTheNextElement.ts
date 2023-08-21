import {RefObject} from 'react';

export const scrollToTheNextElement = (
  screenWrapperRef: RefObject<HTMLDivElement>,
  elementRef: RefObject<HTMLDivElement>,
) => {
  const offsetTop = elementRef?.current?.offsetTop;
  const elementHeight = elementRef?.current?.clientHeight;
  const viewportHeight = window.innerHeight; // 100vh
  const topSpace = 148; // headerHeight + screenWrapperPaddingTop + elementPaddingTop
  let scrollPosition = 0;

  if (elementHeight && offsetTop && viewportHeight && screenWrapperRef.current) {
    scrollPosition = offsetTop - screenWrapperRef.current.clientHeight + elementHeight + viewportHeight - topSpace;
  }

  setTimeout(() => {
    screenWrapperRef?.current?.scrollTo({
      top: scrollPosition || 0,
      behavior: 'smooth',
    });
  }, 100);
};

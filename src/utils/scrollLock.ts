let lockCount = 0;
let prevBodyOverflow = "";
let prevHtmlOverflow = "";
let prevBodyTouchAction = "";
let prevHtmlTouchAction = "";

export function lockScroll() {
  lockCount += 1;
  if (lockCount === 1) {
    const body = document.body;
    const html = document.documentElement;
    prevBodyOverflow = body.style.overflow;
    prevHtmlOverflow = html.style.overflow;
    prevBodyTouchAction = body.style.touchAction;
    prevHtmlTouchAction = html.style.touchAction;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    body.style.touchAction = "none";
    html.style.touchAction = "none";
  }

  return () => {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount !== 0) return;

    const body = document.body;
    const html = document.documentElement;
    body.style.overflow = prevBodyOverflow;
    html.style.overflow = prevHtmlOverflow;
    body.style.touchAction = prevBodyTouchAction;
    html.style.touchAction = prevHtmlTouchAction;
  };
}


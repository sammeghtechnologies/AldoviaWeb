import React from "react";

interface DeferredSectionProps {
  children: React.ReactNode;
  placeholderClassName?: string;
  rootMargin?: string;
}

const DeferredSection: React.FC<DeferredSectionProps> = ({
  children,
  placeholderClassName = "min-h-[60vh]",
  rootMargin = "300px 0px",
}) => {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isVisible || !hostRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );

    observer.observe(hostRef.current);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={hostRef}>
      {isVisible ? children : <div aria-hidden="true" className={placeholderClassName} />}
    </div>
  );
};

export default DeferredSection;

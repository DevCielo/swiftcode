import { useEffect, useRef } from "react";

const useScrollPrevention = (maxScroll = 100, timeoutDuration = 150) => {
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const currentScroll = window.scrollY;

        if (currentScroll > maxScroll) {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }, timeoutDuration); 
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [maxScroll, timeoutDuration]);
};

export default useScrollPrevention;

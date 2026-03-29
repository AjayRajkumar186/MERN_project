import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowUp } from "react-icons/fi";
import { setScrollButtonVisibility } from "../../Store/uiSlice";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.ui.isScrollButtonVisible);

  // 1. Jump to top instantly on route change (Existing logic)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 2. Monitor scroll position to show/hide button via Redux
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        dispatch(setScrollButtonVisibility(true));
      } else {
        dispatch(setScrollButtonVisibility(false));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  const scrollToTopSmooth = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render the button only if Redux state says isVisible
  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTopSmooth}
      className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 cursor-pointer"
      aria-label="Scroll to top"
    >
      <FiArrowUp size={22} />
    </button>
  );
};

export default ScrollToTop;
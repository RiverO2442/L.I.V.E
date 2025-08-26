import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./styles.css";
import { Link } from "@mui/material";
import { navigatePath } from "../../utility/router-config";
import { AuthService } from "../../service/service";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../utility/authContext";

export default function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth(); // 👈 use context

  // Handle scroll
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsScrolled(scrollTop > 20);
  }, []);

  const throttledHandleScroll = useCallback(() => {
    let ticking = false;
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
  }, [handleScroll])();

  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
      setTimeout(() => setIsMobileMenuOpen(false), 150);
    },
    [navigate]
  );

  const onClickLogin = useCallback(async () => {
    if (isAuthenticated) {
      // Logout
      try {
        await AuthService.logout();
      } catch (e) {
        console.error("Logout failed:", e);
      } finally {
        logout(); // update context immediately
        navigate("/login"); // redirect
      }
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, logout, navigate]);

  const handleResize = useCallback(() => {
    if (window.innerWidth > 768 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  // Prevent body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  useEffect(() => {
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [throttledHandleScroll]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <nav className={`nav ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="nav-container">
            <div
              className="logo"
              onClick={() => handleNavigation(navigatePath.home)}
              role="button"
              tabIndex={0}
            >
              L.I.V.E
            </div>

            <ul
              className={`nav-links ${
                isMobileMenuOpen
                  ? "nav-links-mobile active"
                  : "nav-links-mobile"
              }`}
              id="navLinks"
            >
              {isAuthenticated && (
                <>
                  <li>
                    <Link
                      className="cursor-pointer nav-link"
                      onClick={() => handleNavigation(navigatePath.home)}
                      component="button"
                      underline="none"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="cursor-pointer nav-link"
                      onClick={() => handleNavigation("progress")}
                      component="button"
                      underline="none"
                    >
                      Progress
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  className="cursor-pointer nav-link"
                  onClick={onClickLogin}
                  component="button"
                  underline="none"
                >
                  {!isAuthenticated ? "Login" : "Logout"}
                </Link>
              </li>
              <li>
                <Link
                  className="cursor-pointer nav-link"
                  onClick={() => handleNavigation("about")}
                  component="button"
                  underline="none"
                >
                  About
                </Link>
              </li>
            </ul>

            <button
              className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}
              id="mobileMenu"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          role="button"
          tabIndex={0}
        />
      )}
    </>
  );
}

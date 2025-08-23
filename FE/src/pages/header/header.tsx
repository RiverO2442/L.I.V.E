import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles.css";
import { Link } from "@mui/material";
import { navigatePath } from "../../utility/router-config";

export default function Header({ onSearchChange }: any) {
  const navigate = useNavigate();
  // const location = useLocation();
  // const [search, setSearch] = useState("");
  const [verifyLogin, setVerifyLogin] = useState<any>(
    localStorage.getItem("token") ?? false
  );
  const onClickLogin = () => {
    localStorage.getItem("accessToken") &&
      localStorage.removeItem("accessToken");
    navigate("/login");
  };
  useEffect(() => {
    setVerifyLogin(localStorage.getItem("accessToken") ?? false);
  });
  return (
    <nav>
      <div className="container">
        <div className="nav-container">
          <div
            className="logo"
            onClick={() => {
              navigate(`${navigatePath.home}`);
            }}
          >
            L.I.V.E
          </div>
          <ul className="nav-links" id="navLinks">
            <li>
              <Link
                className="cursor-pointer"
                onClick={() => {
                  navigate(`${navigatePath.home}`);
                }}
              >
                Home
              </Link>
            </li>
            {/* <li>
              <Link
                className="cursor-pointer"
                onClick={() => {
                  navigate("modules");
                }}
              >
                Modules
              </Link>
            </li> */}
            <li>
              <Link
                className="cursor-pointer"
                onClick={() => {
                  navigate("progress");
                }}
              >
                Progress
              </Link>
            </li>
            <li className={`${verifyLogin && "hidden"}`}>
              <Link className="cursor-pointer" onClick={() => onClickLogin()}>
                {"Login"}
              </Link>
            </li>
            <li className={`${!verifyLogin && "hidden"}`}>
              <Link className="cursor-pointer" onClick={() => onClickLogin()}>
                {"Logout"}
              </Link>
            </li>
            <li>
              <Link
                className="cursor-pointer"
                onClick={() => {
                  navigate("about");
                }}
              >
                About
              </Link>
            </li>
          </ul>
          <button className="mobile-menu" id="mobileMenu">
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
}

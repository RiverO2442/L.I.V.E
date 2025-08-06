import { useLocation, useNavigate } from "react-router-dom";
import { AutoComplete, Button, Input, Select } from "antd";
import { useEffect, useState } from "react";
import {
  deleteSearch,
  fetchRecentSearches,
  saveSearch,
} from "../../service/service";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import "./styles.css";
import { Link } from "@mui/material";
import { navigatePath } from "../../utility/router-config";

export default function Header({ onSearchChange }: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const onLogo = () => {
    navigate(`/`);
  };
  const [search, setSearch] = useState("");
  const [recentSearch, setRecentSearch] = useState<any>();
  const handleSaveSearchPromp = async () => {
    try {
      (await saveSearch(search)) as any;
      handleGetSearch();
    } catch (error: any) {
      console.log(
        `${error.response?.data?.message || "Something went wrong."} `
      );
    }
  };
  const handleDeleteSearchPromp = async (id: any) => {
    try {
      (await deleteSearch(id)) as any;
      handleGetSearch();
    } catch (error: any) {
      console.log(
        `${error.response?.data?.message || "Something went wrong."} `
      );
    }
  };
  const handleGetSearch = async () => {
    try {
      const data = await fetchRecentSearches();
      if (data?.data?.searches?.length == 0) {
        setRecentSearch([]);
      } else
        setRecentSearch(
          data?.data?.searches.map((item: any) => {
            return {
              key: item.id,
              value: item.query,
            };
          })
        );
    } catch (error: any) {
      console.log(
        `${error.response?.data?.message || "Something went wrong."} `
      );
    }
  };
  const verifyLogin = localStorage.getItem("token") ?? false;
  useEffect(() => {
    handleGetSearch();
  }, []);
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
            <li>
              <Link
                className="cursor-pointer"
                onClick={() => {
                  navigate("modules");
                }}
              >
                Modules
              </Link>
            </li>
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

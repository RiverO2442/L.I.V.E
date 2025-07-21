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
          <div className="logo">L.I.V.E</div>
          <ul className="nav-links" id="navLinks">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="modules">Modules</a>
            </li>
            <li>
              <a href="#progress">Progress</a>
            </li>
            <li>
              <a href="#about">About</a>
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

import { useLocation, useNavigate } from "react-router-dom";
import { AutoComplete, Button, Input, Select } from "antd";
import { useEffect, useState } from "react";
import {
  deleteSearch,
  fetchRecentSearches,
  saveSearch,
} from "../../service/service";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";

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
    <div
      className={`"w-full h-auto items-center justify-center"2 ${
        location.pathname === "/login" && "hidden"
      }`}
    >
      <header className=" bg-blue-600">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex-shrink-0">
              <img
                onClick={() => {
                  onLogo();
                }}
                src="/logo.png"
                alt="Logo"
                className="w-auto h-16 min-w-50 cursor-pointer"
              />
            </div>
            <div
              className={`flex gap-2 ${location.pathname !== "/" && "hidden"}`}
            >
              <AutoComplete
                options={recentSearch}
                onSelect={(e) => {
                  setSearch(e);
                }}
                optionRender={(option) => {
                  return (
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{option?.value}</span>
                      <Button
                        danger
                        size="small"
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSearchPromp(option.key);
                          setRecentSearch((prev: any) =>
                            prev.filter(
                              (item: any) => item.value !== option.value
                            )
                          );
                        }}
                      />
                    </span>
                  );
                }}
              >
                <Input
                  size="large"
                  placeholder="Search media by name"
                  prefix={<SearchOutlined />}
                  allowClear
                  onChange={(e: any) => {
                    setSearch(e?.target?.value);
                  }}
                />
              </AutoComplete>
              <Button
                size="large"
                type="primary"
                onClick={() => {
                  handleSaveSearchPromp();
                  onSearchChange(search);
                }}
              >
                search
              </Button>
              <Select
                defaultValue={"image"}
                placeholder="Type"
                size="large"
                style={{ width: 120 }}
                onChange={(e: any) => {
                  onSearchChange({
                    mediaType: e,
                  });
                }}
                options={[
                  { value: "image", label: "Image" },
                  { value: "audio", label: "Audio" },
                ]}
              />
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100"
              >
                <svg
                  className="block w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8h16M4 16h16"
                  />
                </svg>
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex gap-2 justify-center items-start">
                <div>
                  <a
                    href="/"
                    title=""
                    className="items-center justify-center px-4 py-3 text-base font-semibold transition-all duration-200 bg-blue-500 border border-transparent rounded-md lg:inline-flex hover:bg-blue-700 focus:bg-blue-700 hover:text-blue-900 focus:text-blue-900"
                  >
                    <p className="text-white">Media</p>
                  </a>
                </div>
                <div className={`${verifyLogin && "hidden"}`}>
                  <a
                    title=""
                    className={`"items-center justify-center px-4 py-3 text-base font-semibold transition-all duration-200 bg-blue-500 border border-transparent rounded-md lg:inline-flex hover:bg-blue-700 focus:bg-blue-700 hover:text-blue-900 focus:text-blue-900"`}
                    role="button"
                  >
                    <p
                      className="text-white"
                      onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                      }}
                    >
                      Login
                    </p>
                  </a>
                </div>
                <div className={`${!verifyLogin && "hidden"}`}>
                  <a
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                    title=""
                    className={`"items-center justify-center px-4 py-3 text-base font-semibold transition-all duration-200 bg-blue-500 border border-transparent rounded-md lg:inline-flex hover:bg-blue-700 focus:bg-blue-700 hover:text-blue-900 focus:text-blue-900"`}
                    role="button"
                  >
                    <p className="text-white">Logout</p>
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}

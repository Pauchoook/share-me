import React, { useState, useEffect, useRef } from "react";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import useUserStore from "../store/user";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CATEGORY, CREATE_PIN, HOME, SEARCH, USER_PROFILE } from "../utils/path";
import usePinStore from "../store/pin";

const Navbar: React.FC = () => {
  const { user } = useUserStore();
  const { setSearchValue } = usePinStore();
  const navigate = useNavigate();
  const [value, setValue] = useState<string>("");
  const timeout = useRef<any>();
  const param = useParams();

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (param["*"] && !param["*"].includes("category")) {
        navigate(HOME);
      }
      setSearchValue(value);
    }, 500);
  }, [value]);

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb7">
      <div className="flex justify-start items-center flex-1 px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          placeholder="Search"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <Link to={USER_PROFILE + "/" + user?.sub} className="hidden md:block">
        <img src={user?.picture} alt="avatar" className="w-12 h-12 rounded-full" />
      </Link>
      <Link
        to={CREATE_PIN}
        className="bg-black text-white rounded-full w-12 h-12 flex justify-center items-center"
      >
        <IoMdAdd />
      </Link>
    </div>
  );
};

export default Navbar;

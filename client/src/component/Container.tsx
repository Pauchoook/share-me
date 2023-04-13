import React, { useEffect, useRef, useState } from "react";
import useUserStore from "../store/user";
import Sidebar from "./Sidebar";
import { HiMenu } from "react-icons/hi";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { AiFillCloseCircle } from "react-icons/ai";
import Navbar from "./Navbar";
import { USER_PROFILE } from "../utils/path";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  const { user } = useUserStore();
  const [isSidebar, setIsSidebar] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar closeSidebar={() => setIsSidebar(false)} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setIsSidebar(true)} />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={USER_PROFILE + "/" + user?.sub}>
            <img src={user?.picture} alt="user avatar" className="w-9 h-9 rounded-full " />
          </Link>
        </div>
        {isSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setIsSidebar(false)} />
            </div>
            <Sidebar closeSidebar={() => setIsSidebar(false)} />
          </div>
        )}
      </div>
      <div id="container-scroll" className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <div className="px-2 md:px-5">
          <div className="bg-gray-50">
            <Navbar />
          </div>
          <div className="h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Container;

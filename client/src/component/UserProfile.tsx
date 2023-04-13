import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { IUser, IUserDoc } from "../type/user";
import { IPin } from "../type/pin";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from "../utils/data";
import { client } from "../utils/client";
import { googleLogout } from "@react-oauth/google";
import MasonryLayout from "./MasonryLayout";
import usePinStore from "../store/pin";
import { LOGIN } from "../utils/path";

const randomImage = "https://source.unsplash.com/1600x900/?nature,photography,techonolgy";
const activeBtnStyles = "bg-red-500 text-white font-bold p-2 rounded-full outline-none";
const notActiveBtnStyles = "bg-primary p-2 text-black font-bold p-2 rounded-full outline-none";

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const { pins, getUserPins, maxPins, loading, slicePins } = usePinStore();
  const [text, setText] = useState<string>("Created");
  const [activeBtn, setActiveBtn] = useState<string>("created");
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const query = userQuery(userId || "");

    client.fetch(query).then((data: IUserDoc[]) => {
      setUser({ ...data[0], name: data[0]?.username, sub: data[0]?._id });
    });
  }, [userId]);

  const onLogout = () => {
    navigate(LOGIN);
  };

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId || "");
      getUserPins(user?.sub || "", createdPinsQuery);
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId || "");
      getUserPins(user?.sub || "", savedPinsQuery);
    }
  }, [text]);

  const handlerMore = () => {
    slicePins(10, "", user?.sub);
  };

  if (!user) {
    return <Spinner message="Loading profile" />;
  }

  return (
    <div className="relative pb-2 pt-4 h-full flex justify-center items-center">
      <div className="flex flex-col pb-5 w-full">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              alt="banner picture"
              className="w-full rounded-lg h-370 2xl:h-510 shadow-xl object-cover"
            />
            <img src={user?.picture} alt="user avatar" className="rounded-full w-20 h-20 -mt-10 shadow-md" />
            <h1 className="font-bold text-3xl text-center mt-3">{user.name}</h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user.sub && (
                <button onClick={onLogout} className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md">
                  <AiOutlineLogout fontSize={21} color="red" />
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-center text-center mt-3 mb-7 gap-3">
            <button
              type="button"
              onClick={() => {
                setText("Created");
                setActiveBtn("created");
              }}
              className={`${activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles}`}
            >
              {loading && text === "Created" ? "Getting..." : "Created pins"}
            </button>
            <button
              type="button"
              onClick={() => {
                setText("Saved");
                setActiveBtn("saved");
              }}
              className={`${activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles}`}
            >
              {loading && text === "Saved" ? "Getting..." : "Saved pins"}
            </button>
          </div>
          <div className="px-2">
            {!pins.length ? <h2 className="font-bold text-center">Pins absent :c</h2> : <MasonryLayout pins={pins} />}
            {loading && <Spinner message="We are adding new ideas to your feed!" />}
            {maxPins <= pins.length && !loading && (
              <button
                disabled={loading}
                onClick={handlerMore}
                className="w-full mt-2 text-white font-bold cursor-pointer bg-red-500 py-2 px-3 rounded-lg"
              >
                More pins
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

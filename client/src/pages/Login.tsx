import React from "react";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import useUserStore from "../store/user";
import jwtDecode from "jwt-decode";
import {client} from "../utils/client";
import {IUser, IUserDoc} from "../type/user";
import {useNavigate} from "react-router-dom";
import { HOME } from "../utils/path";

const Login: React.FC = () => {
  const {addUser} = useUserStore();
  const navigate = useNavigate();

  const login = (response: CredentialResponse) => {
    if (!response.credential) {
      throw new Error("No credential")
    }
    const user: IUser = jwtDecode(response.credential);

    const userDoc: IUserDoc = {
      _id: user.sub,
      _type: "user",
      username: user?.name,
      picture: user?.picture,
      family_name: user.family_name,
      given_name: user.given_name,
      email: user.email
    }

    localStorage.setItem("userId", JSON.stringify(userDoc._id));
    addUser(user);
    client.createIfNotExists(userDoc).then(() => navigate(HOME));
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          className="w-full h-full object-cover"
          src={shareVideo}
          loop
          controls={false}
          muted
          autoPlay
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo}
                 width="130px"
                 alt="logo"/>
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              onSuccess={login}
              useOneTap
              auto_select
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

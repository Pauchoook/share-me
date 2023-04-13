import React, { useEffect } from "react";
import AppRouter from "./component/AppRouter";
import { GoogleOAuthProvider } from "@react-oauth/google";
import useUserStore from "./store/user";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "./utils/path";

function App() {
  const { user, addUser, checkUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      checkUser();
    } else {
      navigate(LOGIN);
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={"" + process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AppRouter />
    </GoogleOAuthProvider>
  );
}

export default App;

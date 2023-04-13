import React from "react";
import Container from "../component/Container";
import Feed from "../component/Feed";
import { Routes, Route } from "react-router-dom";
import { homePageRoutesPrivate, homePageRoutesPublic } from "../utils/routes";
import useUserStore from "../store/user";

const Home: React.FC = () => {
  const {user} = useUserStore();

  return (
    <Container>
      <Routes>
        {homePageRoutesPublic.map(({path, Component}) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        {user && homePageRoutesPrivate.map(({path, Component}) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </Container>
  );
};

export default Home;

import React from "react";
import { publicRoutes } from "../utils/routes";
import { Route, Routes, Navigate } from "react-router";
import { HOME } from "../utils/path";

const AppRouter: React.FC = () => {
  return (
    <>
      <Routes>
        {publicRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<Navigate to={HOME} />} />
      </Routes>
    </>
  );
};

export default AppRouter;

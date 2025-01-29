import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "../views/Main";
import Error from "../views/Error";

export default function router() {
  return (
    <Routes>
      <Route path="*" element={<Error />} />
      <Route path="/" element={<Main />} />
    </Routes>
  );
}

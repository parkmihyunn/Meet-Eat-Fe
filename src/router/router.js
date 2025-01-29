import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "../views/Main";
import Error from "../views/Error";
import Account from "../views/Account";
import MyPage from "../views/MyPage";
import OpenChat from "../views/OpenChat";

export default function router() {
  return (
    <Routes>
      <Route path="*" element={<Error />} />
      <Route path="/" element={<Main />} />
      <Route path="/account" element={<Account />} />
      <Route path="/mypage/:id" element={<MyPage />} />
      <Route path="/openchat" element={<OpenChat />} />
    </Routes>
  );
}

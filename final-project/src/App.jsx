import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import RegisterModal from "./pages/Auth/RegisterModal";
import FindAccount from "./pages/Auth/FindAccount";
import AdminPage from "./pages/Admin/AdminPage"; // ✅ MyPage처럼 관리
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoute";
import Header from "./header-footer/Header";
import Footer from "./header-footer/Footer";
import MyPage from "./pages/MyPage/MyPage";
import TarotPage from "./pages/Tarot/TarotPage"; // ✅ 폴더까지 명시

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<RegisterModal />} />
        <Route path="/find-account" element={<FindAccount />} />
           {/* ✅ 타로 카드 추천 페이지 추가 */}
           <Route path="/tarot" element={<TarotPage />} />
        {/* ✅ 관리자 페이지를 MyPage처럼 관리 */}
        <Route path="/admin/*" element={<ProtectedAdminRoute><AdminPage /></ProtectedAdminRoute>} />

        <Route path="/mypage/*" element={<MyPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

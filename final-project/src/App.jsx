import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import RegisterModal from "./pages/Auth/RegisterModal";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Header from "./header-footer/header";
import Footer from "./header-footer/footer";
import MyPage from "./pages/MyPage/MyPage";
import FindAccount from "./pages/Auth/FindAccount";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // ✅ localStorage 변경 감지해서 isLoggedIn 업데이트
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
      {/* ✅ isLoggedIn 상태를 Header에 전달 */}
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<RegisterModal />} />
        <Route path="/mypage/*" element={<MyPage />} /> {/* ✅ 여기 꼭 수정 */}
        <Route path="/find-account" element={<FindAccount />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

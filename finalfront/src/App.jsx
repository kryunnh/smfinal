import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import RegisterModal from "./pages/Auth/RegisterModal";
import FindAccount from "./pages/Auth/FindAccount";
import AdminPage from "./pages/Admin/AdminPage";
import ProtectedAdminRoute from "./component/Admin/ProtectedAdminRoute";
import Header from "./header-footer/Header";
import Footer from "./header-footer/Footer";
import MyPage from "./pages/MyPage/MyPage";
import TarotPage from "./pages/Tarot/TarotPage";
import List from './pages/Recipes/List';
import Korean from './pages/Korean/Korean';
import Chinese from './pages/Chinese/Chinese';
import Western from './pages/Western/Western';
import Popular from './pages/Popular/Popular';
import Challenge from './pages/Challenge/Challenge';
import Japanese from './pages/Japanese/Japanese';
import ListDetail from './pages/Recipes/ListDetail';
import BoardList from './pages/Board/BoardList';
import BoardDetail from './pages/Board/BoardDetail';
import BoardWrite from './pages/Board/BoardWrite';
import BoardUpdate from './pages/Board/BoardUpdate';
import ReportForm from './pages/Board/ReportForm';
import ClubList from './pages/Club/ClubList';
import ClubDetail from './pages/Club/ClubDetail';
import ClubWrite from './pages/Club/ClubWrite';
import ClubApply from './pages/Club/ClubApply';
import Chatbot from './pages/Chatbot/Chatbot';
import ChatbotButton from './pages/Chatbot/ChatbotButton';
import ChallengeForm from './pages/ChallengForm/ChallengeForm';
import Ocr from './pages/Ocr/Ocr';
import ChallengeDetail from "./pages/Challenge/ChallengeDetail";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <AppWithRouting isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </BrowserRouter>
  );
}

function AppWithRouting({ isLoggedIn, setIsLoggedIn }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  

  const hasShownAlertRef = useRef(false); // alert 중복 방지
  const firstEffectDone = useRef(false);  // React.StrictMode 대응

  console.log("🔥 AppWithRouting 렌더링됨");
  console.log("📌 현재 경로:", location.pathname);
  console.log("📦 hasShownAlertRef.current:", hasShownAlertRef.current);
  console.log("🎯 firstEffectDone.current:", firstEffectDone.current);


  // 로그인 상태 실시간 반영
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setIsLoggedIn]);

  // 🚨 경로가 알림 페이지가 아닌 경우에만 alert 플래그 초기화
  useEffect(() => {
    if (location.pathname !== "/mypage/notifications") {
      console.log("🚦 알림 페이지 아님 → alert 초기화");
      hasShownAlertRef.current = false;
    }
  }, [location.pathname]);

  // 관리자 알림 확인
  useEffect(() => {
    console.log("🌀 useEffect 실행됨");

    if (!firstEffectDone.current) {
      console.log("⛔ 첫 마운트로 인해 실행 방지");
      firstEffectDone.current = true;
      return;
    }

    const checkAdminNotification = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (hasShownAlertRef.current) {
        console.log("🚫 alert 이미 표시됨 → 중단");
        return;
      }

      hasShownAlertRef.current = true;

      try {
        console.log("📡 관리자 알림 확인 요청 시작");
        const res = await axios.get("http://localhost:8080/api/notifications/unread", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📥 관리자 알림 응답:", res.data);

        const unreadAdminAlert = res.data.find(
          (n) => n.message?.startsWith("[관리자]") && !n.isRead
        );

        if (unreadAdminAlert) {
          console.log("⚠️ 미확인 관리자 알림 → alert + 이동");
          alert("⚠️ 관리자 알림을 먼저 확인해주세요.");
          navigate("/mypage/notifications");
        } else {
          console.log("✅ 관리자 알림 없음");
        }
      } catch (error) {
        console.error("❌ 관리자 알림 확인 실패:", error);
      }
    };

    checkAdminNotification();
  }, [location.pathname, navigate]);

   // 챗봇 열기/닫기
   const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };

  // report 페이지에서는 헤더/푸터 숨기기
  const isReportPage = location.pathname.startsWith("/report/");


  return (
    <>
      {!isReportPage && <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<RegisterModal />} />
        <Route path="/find-account" element={<FindAccount />} />
        <Route path="/tarot" element={<TarotPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/mypage/*" element={<MyPage />} />
        <Route path="list" element={<List />} />
        <Route path="list/:id" element={<ListDetail />} />
        <Route path="korean" element={<Korean />} />
        <Route path="japanese" element={<Japanese />} />
        <Route path="chinese" element={<Chinese />} />
        <Route path="western" element={<Western />} />
        <Route path="popular" element={<Popular />} />
        <Route path="challenge" element={<Challenge />} />
        <Route path="challenge/:id" element={<ChallengeDetail />} />
        <Route path="challengeform" element={<ChallengeForm />} />
        <Route path="mypage/*" element={<MyPage />} />
        <Route path="boardlist" element={<BoardList />} />
        <Route path="boardlist/:boardId" element={<BoardDetail />} />
        <Route path="boardwrite" element={<BoardWrite />} />
        <Route path="edit/:boardId" element={<BoardUpdate />} />
        <Route path="clublist" element={<ClubList />} />
        <Route path="club/:clubId" element={<ClubDetail />} />
        <Route path="clubwrite" element={<ClubWrite />} />
        <Route path="club/:clubId/apply" element={<ClubApply />} />
        <Route path="ocr" element={<Ocr />} />
         {/* report 페이지 (팝업 스타일) */}
         <Route path="report/:boardId" element={<ReportForm />} />
      </Routes>
      {!isReportPage && (
        <>
          <ChatbotButton onClick={toggleChatbot} />
          {isChatbotOpen && <Chatbot />}
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
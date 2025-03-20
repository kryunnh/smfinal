import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { useState } from 'react';

// 페이지 컴포넌트들
import Home from './pages/Home';
import List from './pages/Recipes/List';
import Korean from './pages/Korean/Korean';
import Chinese from './pages/Chinese/Chinese';
import Western from './pages/Western/Western';
import Popular from './pages/Popular/Popular';
import Challenge from './pages/Challenge/Challenge';
import Japanese from './pages/Japanese/Japanese';
import ListDetail from './pages/Recipes/ListDetail';
import MyPage from './pages/MyPage/MyPage';
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
import Login from './pages/Auth/Login';
import RegisterModal from './pages/Auth/RegisterModal';
import Header from './header-footer/header'
import Footer from './header-footer/footer'
import ChallengeForm from './pages/ChallengForm/ChallengeForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // 챗봇 열기/닫기
  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <div>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="register" element={<RegisterModal />} />
        <Route path="List" element={<List />} />
        <Route path="List/:id" element={<ListDetail />} />
        <Route path="Korean" element={<Korean />} />
        <Route path="Japanese" element={<Japanese />} />
        <Route path="Chinese" element={<Chinese />} />
        <Route path="Western" element={<Western />} />
        <Route path="Popular" element={<Popular />} />
        <Route path="Challenge" element={<Challenge />} />
        <Route path="/mypage/*" element={<MyPage />} />
        <Route path="boardlist" element={<BoardList />} />
        <Route path="boardlist/:boardId" element={<BoardDetail />} />
        <Route path="boardwrite" element={<BoardWrite />} />
        <Route path="/edit/:boardId" element={<BoardUpdate />} />
        <Route path="report/:boardId" element={<ReportForm />} />
        <Route path="clublist" element={<ClubList />} />
        <Route path="/club/:clubId" element={<ClubDetail />} />
        <Route path="clubwrite" element={<ClubWrite />} />
        <Route path="/club/:clubId/apply" element={<ClubApply />} />
        <Route path="/challengeform" element={<ChallengeForm/>}/>
      </Routes>

      {/* 챗봇 버튼은 모든 페이지에서 보이도록 항상 렌더링 */}
      <ChatbotButton onClick={toggleChatbot} />
      {isChatbotOpen && <Chatbot />}  {/* 챗봇 열기/닫기 상태 관리 */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;

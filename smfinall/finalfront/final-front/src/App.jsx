
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import List from './pages/Recipes/List'
import Korean from './pages/Korean/Korean'
import Chinese from './pages/Chinese/Chinese'
import Western from './pages/Western/Western'
import Popular from './pages/Popular/Popular'
import Challenge from './pages/Challenge/Challenge'
import Japanese from './pages/Japanese/Japanese'
import ListDetail from './pages/Recipes/ListDetail'
import Home from './pages/Home'
import Header from './header-footer/header'
import Footer from './header-footer/footer'
import { useEffect, useState } from 'react'
import MyPage from './pages/MyPage/MyPage'
import BoardList from './pages/Board/BoardList';
import BoardDetail from './pages/Board/BoardDetail';
import BoardWrite from './pages/Board/BoardWrite';
import BoardUpdate from './pages/Board/BoardUpdate';
import ReportForm from './pages/Board/ReportForm';
import ClubList from './pages/Club/ClubList';
import Login from "./pages/Auth/Login";
import RegisterModal from "./pages/Auth/RegisterModal";
import ClubDetail from './pages/Club/ClubDetail'
import ClubWrite from './pages/Club/ClubWrite'


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
        <div>
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          
        </div>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="register" element={<RegisterModal/>}/>
          <Route path="List" element={<List />} />
          <Route path="List/:id" element={<ListDetail/>}/> 
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
          
        {/* ✅ 팝업 라우트 추가 */}
        <Route path="report/:boardId" element={<ReportForm />} />

        <Route path="clublist" element={<ClubList />}/>
        <Route path="/club/:clubId" element={<ClubDetail />} /> {/* 상세보기 페이지 */}
        <Route path="clubwrite" element={<ClubWrite />}/>
          </Routes>
          <Footer/>
      </BrowserRouter>
  )
}

export default App
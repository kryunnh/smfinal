import { Link, useLocation, useNavigate } from "react-router-dom";
import './header.css';
import Rabbit from '../assets/rabbit.jpg'
import { useState } from "react";

export default function Header() {
    const [isDropDown, setIsDropDown] = useState(false);
    const navigate = useNavigate(); // useNavigate 훅 사용
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token; // 토큰이 있으면 로그인 상태
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token"); // 토큰 삭제
        localStorage.removeItem("email");
        navigate('/'); // 메인 페이지로 리다이렉션
    };

    return (
        <header className="header">
            <div className="header-logo">
            <h1>냠<Link to={'/'}><img src={Rabbit}/></Link>냠</h1>
            </div>
            <div className="login">
                {isLoggedIn ? (
                    <>
                        <button><Link to={'/mypage'}>마이 페이지</Link></button>
                        <button onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <button><Link to={'/login'}>로그인</Link></button>
                    </>
                )}
            </div>
            <div className="category">
                <div className="category-dropdown"
                    onMouseEnter={()=>setIsDropDown(true)}
                    onMouseLeave={()=>setIsDropDown(false)}>
                    <Link to="/list" className={location.pathname === "/list" ? "active" : ""}>▼ 레시피 목록</Link>
                    {isDropDown && (
                        <div className="dropdown">
                            <Link to={'/Korean'} className={location.pathname === "/Korean" ? "active" : ""}>한식</Link>
                            <Link to={'/Chinese'} className={location.pathname === "/Chinese" ? "active" : ""}>중식</Link>
                            <Link to={'/Japanese'} className={location.pathname === "/Japanese" ? "active" : ""}>일식</Link>
                            <Link to={'/Western'} className={location.pathname === "/Western" ? "active" : ""}>양식</Link>
                            <Link to={'/Popular'} className={location.pathname === "/Popular" ? "active" : ""}>인기 레시피</Link>
                            <Link to={'/Challenge'} className={location.pathname === "/Challenge" ? "active" : ""}>맛있는 도전</Link>
                        </div>
                    )}
                </div>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>다함께 요리하자</Link>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>맛있는 도전하기</Link>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>요리 고민방</Link>
            </div>
        </header>
    );
}

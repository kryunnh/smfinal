import { Link, useNavigate } from "react-router-dom";
import './header.css';
import Rabbit from '../assets/rabbit.png'
import { useState } from "react";

export default function Header() {
    const [isDropDown, setIsDropDown] = useState(false);
    const navigate = useNavigate(); // useNavigate 훅 사용
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token; // 토큰이 있으면 로그인 상태

    const handleLogout = () => {
        localStorage.removeItem("token"); // 토큰 삭제
        navigate('/'); // 메인 페이지로 리다이렉션
    };

    return (
        <header className="header">
            <div className="logo">
            <h1>냠<Link to={'/'}><img src={Rabbit}/></Link>냠</h1>
            </div>
            <div className="login">
                {isLoggedIn ? (
                    <>
                        <button><Link to={'/'}>마이 페이지</Link></button>
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
                    <Link to="/list">▼ 레시피 목록</Link>
                    {isDropDown && (
                        <div className="dropdown">
                            <Link to={'/Korean'}>한식</Link>
                            <Link to={'/Chinese'}>중식</Link>
                            <Link to={'/Japanese'}>일식</Link>
                            <Link to={'/Western'}>양식</Link>
                            <Link to={'/Popular'}>인기 레시피</Link>
                            <Link to={'/Challenge'}>맛있는 도전</Link>
                        </div>
                    )}
                </div>
            <Link to="/">다함께 요리하자</Link>
            <Link to="/">맛있는 도전하기</Link>
            <Link to="/">요리 고민방</Link>
            </div>
        </header>
    );
}

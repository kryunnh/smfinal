import { Link, useLocation, useNavigate } from "react-router-dom";
import './header.css';
import Rabbit from '../assets/rabbit.jpg'
import { useEffect, useState } from "react";

export default function Header({ isLoggedIn, setIsLoggedIn }) {
    const [isDropDown, setIsDropDown] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    

    const navigate = useNavigate(); 
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token"); // 토큰 삭제
        localStorage.removeItem("email");
        setIsLoggedIn(false); 
        setIsAdmin(false);
        navigate('/'); // 메인 페이지로 리다이렉션
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const parts = token.split(".");
                if (parts.length !== 3) {
                    throw new Error("잘못된 토큰 형식입니다.");
                }

                const base64Payload = parts[1];
                const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
                const decodedPayload = JSON.parse(atob(base64));
                
                
                setIsLoggedIn(true); 
                setIsAdmin(decodedPayload.role === "ROLE_ADMIN");
                
            } catch (error) {
                console.error("토큰 디코딩 오류:", error);
                setIsLoggedIn(false);
                setIsAdmin(false); 
            }
        }else{
            setIsLoggedIn(false); 
            setIsAdmin(false); 
        }
    }, [isLoggedIn,setIsAdmin]);

    useEffect(() => {
        if (isLoggedIn) {
            // 이미 로그인된 경우, 새로고침을 한 번만 실행하도록 설정
            const isFirstLoad = sessionStorage.getItem("firstLoad");
            if (!isFirstLoad) {
                sessionStorage.setItem("firstLoad", "true");
                window.location.reload();
            }
        }
    }, [isLoggedIn]);


    const handlePageClick = (path) => {
        if (location.pathname === path) {
            window.location.reload(); // 이미 해당 페이지가 활성화되어 있으면 새로고침
        }
    };

    return (
        <header className="header">
            <div className="header-logo">
            <h1>냠<Link to={'/'}><img src={Rabbit}/></Link>냠</h1>
            </div>
            <div className="login">
                
                {isLoggedIn ? (
                    <>
                    
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
                    <Link to="/list" className={location.pathname === "/list" ? "active" : ""}
                        onClick={() => handlePageClick("/list")
                    }>▼ 레시피 목록</Link>
                    {isDropDown && (
                        <div className="dropdown">
                            <Link to={'/Korean'} className={location.pathname === "/Korean" ? "active" : ""}
                            onClick={() => handlePageClick("/Korean")}
                            >한식</Link>
                            <Link to={'/Chinese'} className={location.pathname === "/Chinese" ? "active" : ""}
                            onClick={() => handlePageClick("/Chinese")}
                            >중식</Link>
                            <Link to={'/Japanese'} className={location.pathname === "/Japanese" ? "active" : ""}
                            onClick={() => handlePageClick("/Japnese")}
                            >일식</Link>
                            <Link to={'/Western'} className={location.pathname === "/Western" ? "active" : ""}
                            onClick={() => handlePageClick("/Western")}
                            >양식</Link>
                            <Link to={'/Popular'} className={location.pathname === "/Popular" ? "active" : ""}
                            onClick={() => handlePageClick("/Popular")}
                            >인기 레시피</Link>
                            <Link to={'/Challenge'} className={location.pathname === "/Challenge" ? "active" : ""}
                            onClick={() => handlePageClick("/Challenge")}
                            >맛있는 도전</Link>
                        </div>
                    )}
                </div>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>다함께 요리하자</Link>
            <Link to="/challengeForm" className={location.pathname === "/challengeForm" ? "active" : ""}>맛있는 도전하기</Link>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>요리 고민방</Link>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>요리 고민방</Link>
            <div className="mypage">
                {isLoggedIn ? (
                    isAdmin ? (
                        <Link to="/admin">
                            <button className="admin-btn">관리자 페이지</button>
                        </Link>
                    ) : (
                        isLoggedIn && (
                            <div className="mypage-dropdown"
                                onMouseEnter={() => setIsDropDown(true)}
                                onMouseLeave={() => setIsDropDown(false)}>
                                <Link to="/mypage" className={location.pathname === "/mypage" ? "active" : ""}>▼ 마이페이지</Link>
                                {isDropDown && (
                                    <div className="dropdown">
                                        <Link to={'/user-edit'} className={location.pathname === "/user-edit" ? "active" : ""}>회원 정보 수정</Link>
                                        <Link to={'/activity'} className={location.pathname === "/activity" ? "active" : ""}>내 활동</Link>
                                        <Link to={'/notifications'} className={location.pathname === "/notifications" ? "active" : ""}>알림</Link>
                                        <Link to={'/inquiry'} className={location.pathname === "/inquiry" ? "active" : ""}>1:1 문의 목록</Link>
                                        <Link to={'/inquiry-write'} className={location.pathname === "/inquiry-write" ? "active" : ""}>1:1 문의 작성</Link>
                                        <Link to={'/withdrawal'} className={location.pathname === "/withdrawal" ? "active" : ""}>회원 탈퇴</Link>
                                    </div>
                                )}
                            </div>
                        )
                    )
                ) : ((null) )}
            </div>
            </div>
        </header>
    );
}

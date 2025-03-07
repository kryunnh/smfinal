import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate(); // useNavigate 훅 사용
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token; // 토큰이 있으면 로그인 상태

    const handleLogout = () => {
        localStorage.removeItem("token"); // 토큰 삭제
        navigate('/'); // 메인 페이지로 리다이렉션
    };

    return (
        <header>
            <h1>레시피 제목</h1>
            <div>
                {isLoggedIn ? (
                    <>
                        <Link to={'/profile'}>내 프로필</Link>
                        <button onClick={handleLogout}>로그아웃</button> {/* 로그아웃 버튼 */}
                    </>
                ) : (
                    <>
                        <Link to={'/login'}>로그인</Link>
                        <Link to={'/register'}>회원가입</Link>
                    </>
                )}
            <Link to={'/'}>홈으로</Link>
            <Link to="/list"><button>Go to Recipe List</button></Link>
            </div>
        </header>
    );
}

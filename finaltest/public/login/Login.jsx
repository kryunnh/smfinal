import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:8080/user/login", {
                email,
                password,
            });

            console.log("로그인 응답 데이터:", response.data);  // 응답 데이터 확인

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("email", email);
                alert("로그인 성공!");
                navigate("/"); // 로그인 후 이동할 페이지
            } else {
                alert("토큰이 없습니다.");
            }
        } catch (error) {
            alert("로그인 실패: " + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div>
            <h2>로그인</h2>
            <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>로그인</button>
            <button><Link to={'/register'}>회원가입</Link></button>
        </div>
    );
}

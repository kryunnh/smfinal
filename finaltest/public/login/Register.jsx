import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [verificationCode, setVerificationCode] = useState(""); 
    const [message, setMessage] = useState("");
    const [verificationEmail, setVerificationEmail] = useState(""); // 이메일 인증을 위한 별도 상태
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post("http://localhost:8080/user/register", {
                email,
                password,
                name,
                phoneNumber,
                profileImage,
            });

            alert("회원가입 성공! 이메일 인증을 진행해주세요.");
        } catch (error) {
            alert("회원가입 실패: " + error.response.data.message);
        }
    };

    const handleEmailVerification = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/user/verify-email', { email: verificationEmail });
            setMessage(response.data);
        } catch (error) {
            setMessage('이메일 인증 코드 전송에 실패했습니다.');
            console.error(error);
        }
    };

    const handleConfirmEmailAndRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/user/confirm-email', {
                email,
                verificationCode,
                password,
                name,
                phoneNumber,
                profileImage,
            });
            alert(response.data); // 회원가입 완료 메시지
            navigate("/login"); // 회원가입 후 로그인 페이지로 이동
        } catch (error) {
            alert("회원가입 완료 실패: " + error.response.data.message);
        }
    };

    return (
        <>
            <div>
                <h2>회원가입</h2>
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="휴대폰 번호"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="프로필 이미지 URL"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                />
                <button onClick={handleRegister}>회원가입</button>
            </div>
            <div>
                <h2>이메일 인증 요청</h2>
                <form onSubmit={handleEmailVerification}>
                    <input
                        type="email"
                        placeholder="이메일 입력"
                        value={verificationEmail} // 이메일 인증을 위한 상태 사용
                        onChange={(e) => setVerificationEmail(e.target.value)}
                        required
                    />
                    <button type="submit">인증 코드 요청</button>
                </form>
                {message && <p>{message}</p>}
            </div>
            <div>
                <h2>인증 코드 입력 및 최종 회원가입</h2>
                <form onSubmit={handleConfirmEmailAndRegister}>
                    <input
                        type="text"
                        placeholder="인증 코드 입력"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />
                    <button type="submit">회원가입 완료</button>
                </form>
            </div>
        </>
    );
}

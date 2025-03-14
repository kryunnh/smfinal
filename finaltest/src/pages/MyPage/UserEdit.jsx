import React, { useState, useEffect } from "react";
import axios from "axios";
import "../MyPageStyle/UserEdit.css";

export default function UserEdit() {
    const [user, setUser] = useState({
        email: "",
        password: "",
        name: "",
        phoneNumber: "",
        profileImage: null, // 파일 객체 or 기존 이미지 URL
    });

    const [preview, setPreview] = useState(null); // 미리보기 URL
    const email = localStorage.getItem("email");

    // 🔹 사용자 정보 불러오기 (useEffect)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        axios.get(`http://localhost:8080/user/get-user?email=${email}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
            setUser({
                ...res.data,
                password: "", // 비밀번호 필드는 초기화
                profileImage: null, // 기존 프로필 이미지 URL 유지
            });

            // 기존 프로필 이미지 미리보기 설정
            if (res.data.profileImagePath) {
                setPreview(`http://localhost:8080/uploads/${res.data.profileImagePath}`);
            }
        })
        .catch(err => console.error("❌ [Error] 사용자 정보 불러오기 실패:", err));
    }, []);

    // 🔹 입력값 변경 핸들러 (이름, 비밀번호, 전화번호)
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // 🔹 이미지 업로드 핸들러
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUser({ ...user, profileImage: file });
            setPreview(URL.createObjectURL(file)); // 미리보기 업데이트
        }
    };
    // 🔹 전화번호 입력 핸들러 (010 고정, 4자리 입력 시 자동으로 - 추가)
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // 숫자만 입력 허용
        value = value.replace(/^010/, ""); // "010"이 중복 입력되지 않도록 방지
    
        if (value.length > 8) value = value.slice(0, 8); // 8자리 초과 입력 방지
    
        let formattedNumber = "010"; // 010 고정
        if (value.length > 4) {
            formattedNumber += "-" + value.slice(0, 4) + "-" + value.slice(4);
        } else if (value.length > 0) {
            formattedNumber += "-" + value;
        }
    
        setUser({ ...user, phoneNumber: formattedNumber });
    };
    // 🔹 회원 정보 수정 요청
    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("email", user.email);
        formData.append("password", user.password || ""); // null 방지
        formData.append("name", user.name);
        formData.append("phoneNumber", user.phoneNumber);
        
        if (user.profileImage) {
            formData.append("file", user.profileImage);
        }
    
        // 🔹 FormData 내용 디버깅
        console.log("📡 [Request] FormData 확인:");
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }
    
        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
    
        axios.put("http://localhost:8080/user/update", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        })
        .then(() => alert("회원 정보 수정 완료!"))
        .catch(err => {
            console.error("❌ [Error] 회원 정보 수정 실패:", err.response);
            alert(`수정 실패: ${err.response?.data?.message || "서버 오류"}`);
        });
    };

    return (
        <div className="user-edit-container">
            <h2>회원 정보 수정</h2>

            <div className="form-group">
                <label>이메일:</label>
                <input type="email" name="email" value={user.email} readOnly />
            </div>

            <div className="form-group">
                <label>비밀번호:</label>
                <input type="password" name="password" value={user.password} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label>이름:</label>
                <input type="text" name="name" value={user.name} onChange={handleChange} />
            </div>

            <div className="form-group">
    <label>전화번호:</label>
    <input 
        type="text" 
        name="phoneNumber" 
        value={user.phoneNumber} 
        onChange={handlePhoneChange} 
        maxLength={13} // 최대 길이 13 ("010-XXXX-XXXX" 포함)
    />
</div>

            {/* 🔹 이미지 업로드 섹션 */}
            <div className="image-upload-container">
                <label>프로필 이미지:</label>
                <input type="file" className="file-input" accept="image/*" onChange={handleImageUpload} />
                {preview && <img src={preview} alt="미리보기" className="image-preview" />}
            </div>

            <button className="submit-btn" onClick={handleSubmit}>수정 완료</button>
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserInfo() {
  const [user, setUser] = useState({ nickname: '', email: '' });

  useEffect(() => {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    if(email && token) {
      axios.get(`http://localhost:8080/user/get-user?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`  // JWT 헤더 추가 ✅
        }
      })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error("에러 발생:", error);
      });
    }
  }, []);

  return (
    <div>
      <h2>회원 정보</h2>
      <p>이름: {user.name}</p>
      <p>이메일: {user.email}</p>
    </div>
  );
}

import React, { useState } from 'react';
import axios from 'axios';

export default function UserWithdrawal({ userEmail }) {
  const [reason, setReason] = useState('');

  const handleWithdrawal = () => {
    axios.post('/user/request-deletion', { email: userEmail, reason })
      .then(() => alert('회원 탈퇴 요청 완료'))
      .catch(console.error);
  };

  return (
    <div>
      <h3>회원 탈퇴</h3>
      <textarea 
        placeholder="탈퇴 사유를 입력해주세요" 
        value={reason} 
        onChange={e => setReason(e.target.value)} />
      <button onClick={handleWithdrawal}>탈퇴 요청하기</button>
    </div>
  );
}

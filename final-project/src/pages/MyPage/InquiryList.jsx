import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function InquiryList({ userEmail }) {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    axios.get(`/user/inquiries/list?email=${userEmail}`)
      .then(res => setInquiries(res.data))
      .catch(console.error);
  }, [userEmail]);

  const deleteInquiry = (id) => {
    axios.delete('/user/inquiries/delete', { data: { inquiryId: id, email: userEmail } })
      .then(() => setInquiries(prev => prev.filter(item => item.id !== id)))
      .catch(console.error);
  };

  return (
    <div>
      <h3>내가 작성한 1:1 문의 목록</h3>
      <ul>
        {inquiries.map(i => (
          <li key={i.id}>
            <strong>{i.title}</strong> - {i.content}
            <button onClick={() => deleteInquiry(i.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

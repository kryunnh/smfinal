import React, { useState } from "react";
import axios from "axios";

export default function InquiryForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");

    try {
      await axios.post("http://localhost:8080/user/inquiries", {
        email: email,
        title,
        content: content,
      });
      alert("1:1 문의가 성공적으로 제출되었습니다.");
      setTitle("");
      setContent("");
    } catch (error) {
      alert("문의 제출에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    <div className="inquiry-form-container">
      <h2>1:1 문의하기</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit">문의 제출</button>
      </form>
    </div>
  );
}

import React from "react";
import MyLayout from "../../components/MyPage/MyLayout";
import MySidebar from "../../components/MyPage/MySidebar";
import { Routes, Route } from "react-router-dom";
import UserInfo from "./UserInfo";
import UserEdit from "./UserEdit";
import UserActivity from "./UserActivity";
import Notifications from "./Notifications";
import UserWithdrawal from "./UserWithdrawal";
import InquiryForm from "./InquiryForm"; // ✅ InquiryForm 컴포넌트 import 확인

export default function MyPage({ user }) {
  return (
    <MyLayout user={user}>
      <div className="mypage-container">
        <MySidebar />
        <div className="mypage-content">
          <Routes>
            <Route path="/" element={<UserInfo />} />
            <Route path="user-edit" element={<UserEdit />} />
            <Route path="activity" element={<UserActivity />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="withdrawal" element={<UserWithdrawal />} />
            <Route path="inquiry" element={<InquiryForm />} /> {/* ✅ InquiryForm으로 수정 */}
          </Routes>
        </div>
      </div>
    </MyLayout>
  );
}

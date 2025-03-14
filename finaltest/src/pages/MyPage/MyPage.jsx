
import React from "react";
import MyLayout from "../../MyPage/MyLayout.jsx";
import MySidebar from "../../MyPage/MySidebar.jsx";
import { Routes, Route } from "react-router-dom";
import UserInfo from "./UserInfo.jsx"
import UserEdit from "./UserEdit.jsx"
import UserActivity from "./UserActivity.jsx"
import Notifications from "./Notifications.jsx"
import UserWithdrawal from "./UserWithdrawal.jsx"
import InquiryForm from "./InquiryForm.jsx"



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
            <Route path="inquiry" element={<InquiryForm />} /> 
            <Route path="/mypage/*" element={<MyPage />} /> 
          </Routes>
        </div>
      </div>
    </MyLayout>
  );
}

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("🔍 ProtectedAdminRoute에서 감지된 역할:", user?.role);

  if (!user || (user.role.toUpperCase() !== "ROLE_ADMIN" && user.role.toUpperCase() !== "ADMIN")) {
    console.log("❌ 관리자 권한이 아님, 홈으로 이동");
    return <Navigate to="/" replace />;
  }

  console.log("✅ 관리자 페이지 접근 허용");
  return children;
};

export default ProtectedAdminRoute;

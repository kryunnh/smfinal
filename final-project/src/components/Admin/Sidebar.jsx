import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2>Admin</h2>
      <ul>
        <li><NavLink to="/admin/users">회원 관리</NavLink></li>
        <li><NavLink to="/admin/user-deletion">회원 탈퇴 요청</NavLink></li>
        <li><NavLink to="/admin/recipes">레시피 관리</NavLink></li>
        <li><NavLink to="/admin/statistics">통계 관리</NavLink></li>
        <li><NavLink to="/admin/boards">게시글 관리</NavLink></li>
        <li><NavLink to="/admin/notifications">알림 관리</NavLink></li>
        <li><NavLink to="/admin/inquiries">1:1 문의 관리</NavLink></li>
        <li><NavLink to="/admin/competitions">공모전 레시피 관리</NavLink></li>
      </ul>
    </div>
  );
};

export default Sidebar;

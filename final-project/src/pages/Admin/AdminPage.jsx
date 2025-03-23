import { Routes, Route, NavLink } from "react-router-dom";
import AdminUsers from "./AdminUsers";
import AdminUserDeletions from "./AdminUserDeletions";
import AdminRecipes from "./AdminRecipes"; 
import AdminStatistics from "./AdminStatistics"; 
import AdminBoards from "./AdminBoards"; 
import AdminreportList from "./AdminreportList"; // ✅ 새로 추가한 신고 목록 컴포넌트

import AdminInquiries from "./AdminInquiries"; 
import AdminCompetitions from "./AdminCompetitions"; 
import RecipeForm from "./RecipeForm"; // ✅ 레시피 추가/수정 폼 가져오기
import "../../styles/AdminPage.css"; // ✅ CSS 경로 수정!
import AdminInquiryDetail from "./AdminInquiryDetail"; // ✅ 상세보기 페이지 추가
const AdminPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <h2>Admin</h2>
        <ul>
          <li><NavLink to="/admin/users">회원 관리</NavLink></li>
          <li><NavLink to="/admin/user-deletion">회원 탈퇴 요청</NavLink></li>
          <li><NavLink to="/admin/recipes">레시피 관리</NavLink></li>
          <li><NavLink to="/admin/statistics">통계 관리</NavLink></li>
          <li><NavLink to="/admin/boards">게시글 관리</NavLink></li>
          <li><NavLink to="/admin/notifications">신고 알림 관리</NavLink></li>
          <li><NavLink to="/admin/inquiries">1:1 문의 관리</NavLink></li>
          <li><NavLink to="/admin/competitions">공모전 레시피 관리</NavLink></li>
        </ul>
      </div>

      <div className="admin-content">
        <Routes>
          <Route path="users" element={<AdminUsers />} />
          <Route path="user-deletion" element={<AdminUserDeletions />} />
          <Route path="recipes" element={<AdminRecipes />} />
          <Route path="recipes/add" element={<RecipeForm isEditing={false} />} /> {/* ✅ 추가 */}
          <Route path="recipes/edit/:id" element={<RecipeForm isEditing={true} />} /> {/* ✅ 수정 */}
          <Route path="statistics" element={<AdminStatistics />} />
          <Route path="boards" element={<AdminBoards />} />
          <Route path="notifications" element={<AdminreportList />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="competitions" element={<AdminCompetitions />} />
          <Route path="inquiries/:id" element={<AdminInquiryDetail />} /> {/* ✅ 상세 페이지 추가 */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;

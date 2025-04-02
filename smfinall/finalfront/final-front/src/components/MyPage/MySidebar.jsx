import { Link } from 'react-router-dom';
import './MySidebar.css';

export default function MySidebar() {
  return (
    <nav className="mypage-sidebar">
      <div className="mypage-sidebarul">
        <div className="mypage-sidebarli"><Link to="/mypage/user-edit">회원 정보 수정</Link></div>
        <div className="mypage-sidebarli"><Link to="/mypage/activity">내 활동</Link></div>
        <div className="mypage-sidebarli"><Link to="/mypage/notifications">알림</Link></div>
        <div className="mypage-sidebarli"><Link to="/mypage/inquiry">1:1 문의 목록</Link></div>
        <div className="mypage-sidebarli"><Link to="/mypage/inquiry/new">1:1 문의 작성</Link></div>
        <div className="mypage-sidebarli"><Link to="/mypage/chat">💬 고객센터</Link></div>
        <div className="mypage-sidebarli"><Link to="/mypage/withdrawal">회원 탈퇴</Link></div>
      </div>
    </nav>
  );
}
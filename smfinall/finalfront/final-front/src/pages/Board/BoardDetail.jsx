import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BoardDetail.css";
import BoardLike from "./BoardLike";
import BoardComment from "./BoardComment";

function BoardDetail() {
  const { boardId } = useParams();
  const [boardDetail, setBoardDetail] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let userEmail = null;
  if (token) {
    try {
      // Base64URL → Base64 변환 (패딩 추가)
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const decodedToken = JSON.parse(atob(base64)); // 디코딩
      userEmail = decodedToken.sub; // ✅ 이메일은 'sub' 필드에서 가져오기
    } catch (error) {
      console.error("토큰 디코딩 실패:", error);
    }
  }

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/board/${boardId}`);
        setBoardDetail(response.data);
      } catch (error) {
        console.error("게시글 상세보기 가져오기 실패:", error);
      }
    };

    const incrementViews = async () => {
      try {
        await axios.get(`http://localhost:8080/api/board/${boardId}/incrementviews`);
      } catch (error) {
        console.error("조회수 증가 실패:", error);
      }
    };

    // 게시글 조회 후 조회수 증가
    fetchBoardDetail();
    incrementViews(); // 게시글을 조회할 때 조회수를 증가시킴
  }, [boardId]);

  // 팝업창 열기 함수
  const openReportPopup = () => {
    if (!token) {
      alert("로그인 후 신고할 수 있습니다.");
      return;
    }

    const popup = window.open(
      `/report/${boardId}`,
      "reportPopup",
      "width=600,height=700,top=200,left=500"
    );

    if (!popup) {
      alert("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
    }
  };

  // 게시글 삭제 처리
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/board/${boardId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("게시글이 삭제되었습니다.");
      navigate("/boardlist");  // 게시판 목록 페이지로 리다이렉트
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  // 게시글 수정 처리
  const handleEdit = () => {
    navigate(`/edit/${boardId}`); // 수정 페이지로 이동
  };

  if (!boardDetail) {
    return <div>게시글을 불러오는 중...</div>;
  }

  // 작성자 이메일과 현재 사용자의 이메일을 비교하여 삭제 버튼 활성화 여부 결정
  const canEditOrDelete = userEmail === boardDetail.authorEmail;
  const isLoggedIn = !!token; // 로그인 여부 체크
  const canReport = isLoggedIn && userEmail !== boardDetail.authorEmail; // 신고할 수 있는 조건
  const stripHtml = (html) => {
    return html.replace(/<[^>]+>/g, ''); // 모든 HTML 태그 제거
  };
  return (
    <>
      <div className="page">
        <h1 className="big-title">요리 고민방 자세히 보기</h1>
        <hr />
        <div className="view-board">
          <div className="view-title">{boardDetail.title}</div>
          <div className="view-createdAt">작성일: {boardDetail.createdAt}</div>
          <div className="view-views">조회수: {boardDetail.views}</div>
          <div className="view-author">작성자: {boardDetail.author}</div>
        </div>
        <hr />
        <div className="view-content">{stripHtml(boardDetail.content)}</div>
        <hr />

        {/* 버튼 그룹: 신고 버튼은 로그인한 사용자이고 작성자가 아닌 경우에만 보이도록 처리 */}
        <div className="button-group">
          {canReport && (
            <button className="report-btn" onClick={openReportPopup}>
              신고하기
            </button>
          )}
          {canEditOrDelete && (
            <>
              <button className="edit-btn" onClick={handleEdit}>
                수정하기
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                삭제하기
              </button>
            </>
          )}
        </div>
        <BoardLike boardId={boardId} />
        <BoardComment />
      </div>
    </>
  );
}

export default BoardDetail;

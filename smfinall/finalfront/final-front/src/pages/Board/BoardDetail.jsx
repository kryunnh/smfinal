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
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const decodedToken = JSON.parse(atob(base64));
      userEmail = decodedToken.sub;
    } catch (error) {
      console.error("토큰 디코딩 실패:", error);
    }
  }

  const fetchBoardDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/board/${boardId}`);
      setBoardDetail(response.data);
    } catch (error) {
      console.error("게시글 상세보기 가져오기 실패:", error);
    }
  };

  // 조회수 증가 처리
  const incrementViews = async () => {
    try {
      // 서버에 조회수 증가 요청
      await axios.get(`http://localhost:8080/api/board/${boardId}/incrementviews`);
    } catch (error) {
      console.error("조회수 증가 실패:", error);
    }
  };

  useEffect(() => {
    // 페이지 로드 시마다 조회수 증가
    fetchBoardDetail();
    incrementViews();
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
      await axios.delete(`http://localhost:8080/api/board/${boardId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("게시글이 삭제되었습니다.");
      navigate("/boardlist");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  // 게시글 수정 처리
  const handleEdit = () => {
    navigate(`/edit/${boardId}`);
  };

  if (!boardDetail) {
    return <div>게시글을 불러오는 중...</div>;
  }

  const canEditOrDelete = userEmail === boardDetail.authorEmail;
  const isLoggedIn = !!token;
  const canReport = isLoggedIn && userEmail !== boardDetail.authorEmail;

  return (
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

      <div className="view-content" dangerouslySetInnerHTML={{ __html: boardDetail.content }} />
      
      <hr />

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
  );
}

export default BoardDetail;
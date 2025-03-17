import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./BoardComment.css";

const BoardComment = () => {
  const { boardId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [editCommentContent, setEditCommentContent] = useState({});
  const [isEditingComment, setIsEditingComment] = useState(null);
  const [isEditingReply, setIsEditingReply] = useState(null); // 대댓글 수정 상태 추가
  const [editReplyContent, setEditReplyContent] = useState({}); // 대댓글 수정 내용
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

  // 📌 댓글과 대댓글 목록 불러오기
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/board/${boardId}/comments`)
      .then((response) => {
        const updatedComments = response.data.map((comment) => {
          // 대댓글 목록도 함께 불러오기
          return axios
            .get(`http://localhost:8080/api/board/comment/${comment.commentId}/replies`)
            .then((replyResponse) => ({
              ...comment,
              replies: replyResponse.data, // 대댓글 추가
            }));
        });

        // 모든 댓글과 대댓글을 동시에 불러오기
        Promise.all(updatedComments)
          .then((commentsWithReplies) => setComments(commentsWithReplies))
          .catch((error) => console.error("대댓글 불러오기 실패:", error));
      })
      .catch((error) => console.error("댓글 목록 가져오기 실패:", error));
  }, [boardId]);

  // 📌 댓글 삭제 처리
  const handleDeleteComment = (commentId) => {
    if (!token) {
      alert("로그인 후 삭제할 수 있습니다.");
      return;
    }
    axios
      .delete(`http://localhost:8080/api/board/${boardId}/deletecomment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.commentId !== commentId)
        );
        alert("댓글이 삭제되었습니다.");
      })
      .catch((error) => {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제에 실패했습니다.");
      });
  };

  // 📌 대댓글 삭제 처리
  const handleDeleteReply = (commentId, replyId) => {
    if (!token) {
      alert("로그인 후 대댓글을 삭제할 수 있습니다.");
      return;
    }

    axios
      .delete(`http://localhost:8080/api/board/${boardId}/deletereply/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        const updatedComments = comments.map((comment) => {
          if (comment.commentId === commentId) {
            comment.replies = comment.replies.filter((reply) => reply.commentId !== replyId);
          }
          return comment;
        });
        setComments(updatedComments);
        alert("대댓글이 삭제되었습니다.");
      })
      .catch((error) => {
        console.error("대댓글 삭제 실패:", error);
        alert("대댓글 삭제에 실패했습니다.");
      });
  };

  // 📌 댓글 추가하기
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!token) return alert("로그인 후 댓글을 작성할 수 있습니다.");

    axios
      .post(
        `http://localhost:8080/api/board/${boardId}/addcomment`,
        { content: newComment, boardId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setComments((prevComments) => [...prevComments, response.data]);
        setNewComment("");
        axios
        .get(`http://localhost:8080/api/board/${boardId}/comments`)
        .then((response) => {
          const updatedComments = response.data.map((comment) => {
            // 대댓글 목록도 함께 불러오기
            return axios
              .get(`http://localhost:8080/api/board/comment/${comment.commentId}/replies`)
              .then((replyResponse) => ({
                ...comment,
                replies: replyResponse.data, // 대댓글 추가
              }));
          });
  
          // 모든 댓글과 대댓글을 동시에 불러오기
          Promise.all(updatedComments)
            .then((commentsWithReplies) => setComments(commentsWithReplies))
            .catch((error) => console.error("대댓글 불러오기 실패:", error));
        })
        .catch((error) => console.error("댓글 목록 가져오기 실패:", error));
      })
      
      .catch((error) => console.error("댓글 추가 실패:", error));
  };

  // 📌 대댓글 추가하기
  const handleAddReply = (e, parentId) => {
    e.preventDefault();
    if (!token) return alert("로그인 후 대댓글을 작성할 수 있습니다.");
    axios
    .post(
      `http://localhost:8080/api/board/${boardId}/addreply`,
      { content: replyContent[parentId], replyId: parentId, boardId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response) => {
      // 대댓글을 추가한 댓글의 replies에 새 대댓글 추가
      const updatedComments = comments.map((comment) =>
        comment.commentId === parentId
          ? {
              ...comment,
              replies: [...(comment.replies || []), response.data],
            }
          : comment
      );
      setComments(updatedComments); // 대댓글 추가 후 상태 업데이트
      setReplyContent({ ...replyContent, [parentId]: "" });
      setShowReplyInput({ ...showReplyInput, [parentId]: false }); // 대댓글 입력란 숨기기
      axios
      .get(`http://localhost:8080/api/board/${boardId}/comments`)
      .then((response) => {
        const updatedComments = response.data.map((comment) => {
          // 대댓글 목록도 함께 불러오기
          return axios
            .get(`http://localhost:8080/api/board/comment/${comment.commentId}/replies`)
            .then((replyResponse) => ({
              ...comment,
              replies: replyResponse.data, // 대댓글 추가
            }));
        });

        // 모든 댓글과 대댓글을 동시에 불러오기
        Promise.all(updatedComments)
          .then((commentsWithReplies) => setComments(commentsWithReplies))
          .catch((error) => console.error("대댓글 불러오기 실패:", error));
      })
      .catch((error) => console.error("댓글 목록 가져오기 실패:", error));
    })
    .catch((error) => console.error("대댓글 추가 실패:", error));
  };

   // 댓글 수정 처리
   const handleEditComment = (commentId, newContent) => {
    axios
      .put(
        `http://localhost:8080/api/board/${boardId}/updatecomment/${commentId}`,
        { content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.commentId === commentId ? { ...comment, content: newContent } : comment
          )
        );
        setIsEditingComment(null); // 수정 완료 후 수정 상태 초기화
        alert("댓글이 수정되었습니다.");
      })
      .catch((error) => {
        console.error("댓글 수정 실패:", error);
        alert("댓글 수정에 실패했습니다.");
      });
  };
    
   // 댓글 수정 폼 토글
   const toggleEditComment = (commentId, content) => {
    if (isEditingComment === commentId) {
      setIsEditingComment(null);
      setEditCommentContent({});
    } else {
      setIsEditingComment(commentId);
      setEditCommentContent({ [commentId]: content });
    }
  };
// 대댓글 수정 처리
const handleEditReply = (commentId, replyId, newContent) => {
  axios
    .put(
      `http://localhost:8080/api/board/${boardId}/updatereply/${replyId}`,
      { content: newContent },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response) => {
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.commentId === commentId) {
            comment.replies = comment.replies.map((reply) =>
              reply.commentId === replyId ? { ...reply, content: newContent } : reply
            );
          }
          return comment;
        })
      );
      setIsEditingReply(null);
      alert("대댓글이 수정되었습니다.");
    })
    .catch((error) => {
      console.error("대댓글 수정 실패:", error);
      alert("대댓글 수정에 실패했습니다.");
    });
};
// 대댓글 수정 폼 토글
const toggleEditReply = (commentId, replyId, content) => {
  if (isEditingReply === replyId) {
    setIsEditingReply(null);
    setEditReplyContent({});
  } else {
    setIsEditingReply(replyId);
    setEditReplyContent({ [replyId]: content });
  }
};
    // 📌 답글 입력란 토글 함수
    const toggleReplyInput = (commentId) => {
      setShowReplyInput((prevState) => ({
        ...prevState,
        [commentId]: !prevState[commentId], // 해당 댓글에 대한 답글 폼 상태를 반전
      }));
    };

  // 📌 목록 버튼 클릭 시 boardlist 페이지로 이동
  const handleGoToBoardList = () => {
    navigate("/boardlist");
  };

  return (
    <div className="comment-section">
      <h2>댓글</h2>
      <div className="comment-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.commentId} className="comment-item">
              <div>
                <span>{comment.author}</span>
                {isEditingComment === comment.commentId ? (
                  <form style={{ width: "100%", display: "flex", alignItems: "center" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditComment(comment.commentId, editCommentContent[comment.commentId]);
                    }}
                  >
                    <textarea
                      value={editCommentContent[comment.commentId] || ""}
                      onChange={(e) =>
                        setEditCommentContent({
                          ...editCommentContent,
                          [comment.commentId]: e.target.value,
                        })
                      }
                      rows="3"
                      style={{ flex: "1", minHeight: "80px", resize: "vertical" }}
                    />
                    <button type="submit"  style={{ backgroundColor: "#FFA575", cursor: "pointer" }}>저장</button>
                    <button
                      type="button"
                      onClick={() => setIsEditingComment(null)} // 수정 취소
                    >
                      취소
                    </button>
                  </form>
                ) : (
                  <p>{comment.content}</p>
                )}
                <span className="createdAt">{comment.createdAt}</span>
                <span className="createdAt">수정됨: {comment.updatedAt}</span>
                
                <div className="boardcomment-button">
                  {comment.authorEmail === userEmail && (
                    <button onClick={() => handleDeleteComment(comment.commentId)}>삭제</button>
                  )}
                  {comment.authorEmail === userEmail && (
                    <button onClick={() => toggleEditComment(comment.commentId, comment.content)}>수정</button>
                  )}
                </div>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="replies">
                  {comment.replies.map((reply) => (
                    <div key={reply.commentId} className="reply-item" style={{ paddingLeft: "20px" }}>
                      <span>{reply.author}</span>
                      {isEditingReply === reply.commentId ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleEditReply(comment.commentId, reply.commentId, editReplyContent[reply.commentId]);
                          }}
                        >
                          <textarea
                            value={editReplyContent[reply.commentId] || ""}
                            onChange={(e) =>
                              setEditReplyContent({
                                ...editReplyContent,
                                [reply.commentId]: e.target.value,
                              })
                            }
                            rows="3"
                          />
                          <button type="submit">저장</button>
                          <button type="button" onClick={() => setIsEditingReply(null)}>
                            취소
                          </button>
                        </form>
                      ) : (
                        <p>{reply.content}</p>
                      )}
                      <div className="boardcomment-button">
                        <span className="createdAt">{reply.createdAt}</span> <span className="createdAt">수정됨: {reply.updatedAt}</span>
                        {reply.authorEmail === userEmail && (
                          <button onClick={() => handleDeleteReply(comment.commentId, reply.commentId)}>삭제</button>
                        )}
                        {reply.authorEmail === userEmail && (
                          <button onClick={() => toggleEditReply(comment.commentId, reply.commentId, reply.content)}>
                            수정
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
&nbsp;&nbsp;
              <button
                onClick={() => toggleReplyInput(comment.commentId)}
                style={{
                  backgroundColor: showReplyInput[comment.commentId] ? "#EEEEEE" : "#FFA575",
                }}
              >
                {showReplyInput[comment.commentId] ? "취소" : "답글"}
              </button>
              <br />
              {showReplyInput[comment.commentId] && (
                <form onSubmit={(e) => handleAddReply(e, comment.commentId)} style={{ width: "100%", display: "flex", alignItems: "center" }}>
                  <textarea
                    value={replyContent[comment.commentId] || ""}
                    onChange={(e) =>
                      setReplyContent({ ...replyContent, [comment.commentId]: e.target.value })
                    }
                    rows="3"
                    placeholder="대댓글을 작성하세요..."
                    style={{ flex: "1", minHeight: "80px", resize: "vertical" }}
                  />
                  <button type="submit" style={{ backgroundColor: "#FFA575", height: "90px", cursor: "pointer" }}>
                    작성
                  </button>
                </form>
              )}
              <br />
              <hr />
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>

      <form onSubmit={handleAddComment} style={{ width: "100%", display: "flex", alignItems: "center" }} className="new-comment">
        <textarea 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
          placeholder="댓글을 작성하세요..."
          style={{ flex: "1", minHeight: "80px", resize: "vertical" }}
        />
        <button type="submit" style={{ backgroundColor: "#FFA575", height: "90px", cursor: "pointer" }}>
          댓글 작성
        </button>
      </form>
      <div className="button-container">
        <button onClick={handleGoToBoardList} className="comment-goback">
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default BoardComment;

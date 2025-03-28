import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/UserActivity.css";
import "../../styles/FormStyles.css";

const UserActivity = () => {
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState("");

  const API_BASE_URL = "http://localhost:8080/user";
  const DEFAULT_IMAGE = "/images/default-profile.jpg";
  const IMAGE_BASE_URL = "http://localhost:8080/uploads/";

  // ✅ 로그인된 사용자 정보 (토큰 디코딩 → 이메일 → 유저 ID)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      const extractedEmail = payload.sub || payload.email;

      if (extractedEmail) {
        setEmail(extractedEmail);
        setToken(storedToken);

        // 유저 ID 가져오기
        axios
          .get(`${API_BASE_URL}/get-user?email=${extractedEmail}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          })
          .then((res) => {
            setUserId(res.data.id);
            console.log("✅ 유저 ID:", res.data.id);
          })
          .catch((err) => {
            console.error("❌ 유저 정보 조회 실패:", err);
          });
      }
    } catch (err) {
      console.error("❌ 토큰 파싱 실패:", err);
    }
  }, []);

  // ✅ 즐겨찾기 목록 불러오기
  const fetchFavorites = () => {
    if (!userId || !token) return;

    axios
      .get(`${API_BASE_URL}/${userId}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const updatedFavorites = res.data.map((item) => {
          let imageUrl = item.foodImg;
        
          if (!imageUrl || imageUrl === "undefined" || imageUrl === "null") {
            imageUrl = "/images/default-profile.jpg";
          } else if (!imageUrl.startsWith("http")) {
            const encoded = encodeURIComponent(imageUrl);
            imageUrl = `http://localhost:8080/uploads/${encoded}`;
          }
        
          return {
            ...item,
            imageUrl,
          };
        });

        setFavorites(updatedFavorites);
      })
      .catch((err) => {
        console.error("❌ 즐겨찾기 조회 실패:", err);
      });
  };

  // ✅ 내가 쓴 글 + 즐겨찾기 불러오기
  useEffect(() => {
    if (!email || !userId || !token) return;

    console.log("🚀 게시글 + 즐겨찾기 API 요청 시작");

    axios
      .get(`${API_BASE_URL}/my-board-titles?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPosts(res.data);
        console.log("✅ 게시글 목록:", res.data);
      })
      .catch((err) => {
        console.error("❌ 게시글 조회 실패:", err);
      });

    fetchFavorites();
  }, [email, userId, token]);

  // ✅ 즐겨찾기 삭제
  const handleDeleteFavorite = async (recipeId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const res = await axios.delete(`${API_BASE_URL}/${userId}/favorites/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        alert("삭제되었습니다.");
        fetchFavorites(); // 최신화
      }
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
      alert("삭제 중 오류 발생");
    }
  };

  return (
    <div className="user-activity-container">
      <h2 className="activity-title">마이페이지</h2>

      {/* 내가 작성한 글 */}
      <div className="user-posts-section">
        <h3>📌 내가 올린 글 (요리 고민방)</h3>
        <table className="activity-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{new Date(post.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">작성한 글이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 즐겨찾기 목록 */}
      <div className="favorites-section">
        <h3>💖 관심 목록</h3>
        <div className="favorites-grid">
          {favorites.length > 0 ? (
            favorites.map((item) => (
              <div key={`favorite-${item.recipeId || item.id}`} className="favorite-item">
                <img
                  src={item.imageUrl}
                  alt="관심 항목"
                  className="favorite-image"
                  onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                />
                <button className="favorite-detail-btn">상세보기</button>
                <button
                  className="favorite-remove-btn"
                  onClick={() => handleDeleteFavorite(item.recipeId)}
                >
                  삭제
                </button>
              </div>
            ))
          ) : (
            <p>📌 관심 목록이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivity;

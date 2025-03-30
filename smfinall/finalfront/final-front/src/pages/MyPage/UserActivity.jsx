import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/UserActivity.css";
import { Link } from 'react-router-dom';
import "../../styles/FormStyles.css";

const UserActivity = () => {
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("posts"); // ✅ 현재 활성화된 탭

  const API_BASE_URL = "http://localhost:8080/user";
  const DEFAULT_IMAGE = "/images/default-profile.jpg";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      const extractedEmail = payload.sub || payload.email;

      if (extractedEmail) {
        setEmail(extractedEmail);
        setToken(storedToken);

        axios.get(`${API_BASE_URL}/get-user?email=${extractedEmail}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => setUserId(res.data.id))
        .catch((err) => console.error("❌ 유저 정보 조회 실패:", err));
      }
    } catch (err) {
      console.error("❌ 토큰 파싱 실패:", err);
    }
  }, []);

  useEffect(() => {
    if (!email || !userId || !token) return;

    axios.get(`${API_BASE_URL}/my-board-titles?email=${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setPosts(res.data))
    .catch((err) => console.error("❌ 게시글 조회 실패:", err));

    fetchFavorites();
  }, [email, userId, token]);

  const fetchFavorites = () => {
    if (!userId || !token) return;

    axios.get(`${API_BASE_URL}/${userId}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const updatedFavorites = res.data.map((item) => ({
        ...item,
        imageUrl: item.foodImg ? `http://localhost:8080/uploads/${encodeURIComponent(item.foodImg)}` : DEFAULT_IMAGE
      }));
      setFavorites(updatedFavorites);
    })
    .catch((err) => console.error("❌ 즐겨찾기 조회 실패:", err));
  };

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
      <h1 className="big-title">내 활동</h1>
      {/* ✅ 탭 전환 버튼 */}
      <div className="tab-buttons">
        <button className={activeTab === "posts" ? "active" : "none"} onClick={() => setActiveTab("posts")}>
          내가 쓴 글
        </button>
        <button className={activeTab === "favorites" ? "active" : "none"} onClick={() => setActiveTab("favorites")}>
          관심 목록
        </button>
      </div>

      {/* ✅ 내가 쓴 글 */}
      {activeTab === "posts" && (
        <div className="user-posts-section">
          <table className="thz">
            <tbody className="tdz">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.boardId}>
                  <td> 
                    <Link to={`/boardlist/${post.boardId}`} style={{ textDecoration: "none", color: "inherit" }}>
                      {post.title}
                    </Link>
                  </td>
                    <td>{new Date(post.createdAt).toLocaleString()}</td>
                    <td>{post.views}</td>
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
      )}

      {/* ✅ 관심 목록 */}
      {activeTab === "favorites" && (
        <div className="favorites-section">
          <div className="recipes-grid">
            {favorites.length > 0 ? (
              favorites.map((item) => (
                <div key={`favorite-${item.recipeId || item.id}`} className="recipes-card">
                  <img
                    src={item.imageUrl}
                    alt="관심 항목"
                    className="rc-list-img"
                    onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                  />
                  <h3 className="rc-fn">{item.foodName}</h3>
                  <div className="buttonz-container">
                    <button
                      className="favorite-remove-btn"
                      onClick={() => handleDeleteFavorite(item.recipeId)}
                      >
                      삭제
                    </button>
                    </div>
                </div>
              ))
            ) : (
              <p>📌 관심 목록이 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActivity;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminRecipeStyles.css";

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]); // ✅ 레시피 목록
  const [search, setSearch] = useState(""); // ✅ 검색어 입력 필드
  const [category, setCategory] = useState(""); // ✅ 카테고리 필터
  const [weather, setWeather] = useState(""); // ✅ 날씨 필터
  const navigate = useNavigate();

  // ✅ 페이지가 처음 로드될 때 모든 레시피 가져오기
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (keyword = "", categoryId = "", weatherId = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/admin/recipes", {
        headers: { Authorization: `Bearer ${token}` },
        params: { keyword, categoryId, weatherId },
      });

      console.log("📢 API 응답 데이터:", response.data);
      setRecipes(response.data);
    } catch (error) {
      console.error("❌ 레시피 불러오기 실패:", error);
    }
  };

  // ✅ 검색 버튼 클릭 시 호출
  const handleSearch = () => {
    fetchRecipes(search, category, weather);
  };

  // ✅ 삭제 기능
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/admin/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("레시피 삭제 완료!");
      fetchRecipes(); // ✅ 삭제 후 다시 목록 불러오기
    } catch (error) {
      console.error("❌ 레시피 삭제 실패:", error);
    }
  };

  return (
    <div className="admin-recipe-container">
      <h2 className="admin-recipe-title">레시피 관리</h2>

      <div className="recipe-header">
        {/* 🔎 검색어 입력 */}
        <input
          type="text"
          className="search-bar"
          placeholder="레시피명 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 🔎 카테고리 선택 */}
        <select className="category-filter" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">카테고리 선택</option>
          <option value="1">한식</option>
          <option value="2">중식</option>
          <option value="3">일식</option>
          <option value="4">양식</option>
        </select>

        {/* 🔎 날씨 선택 */}
        <select className="weather-filter" value={weather} onChange={(e) => setWeather(e.target.value)}>
          <option value="">날씨 선택</option>
          <option value="1">맑음</option>
          <option value="2">비</option>
          <option value="3">눈</option>
          <option value="4">흐림</option>
        </select>

        {/* 🔍 검색 버튼 */}
        <button className="search-btn" onClick={handleSearch}>검색</button>

        {/* ➕ 추가 버튼 */}
        <button className="add-btn" onClick={() => navigate("/admin/recipes/add")}>추가하기</button>
      </div>

      {/* 🔥 레시피 목록 표시 */}
      <div className="recipe-list">
        {recipes.map((recipe) => {
          let imageUrl = "/default-image.png"; // 기본 이미지 설정

          if (recipe.foodImg) {
            const encodedImg = encodeURIComponent(recipe.foodImg); // ✅ 파일명 URL 인코딩
            imageUrl = `http://localhost:8080/uploads/${encodedImg}`;
          }

          console.log("📸 이미지 URL 확인:", imageUrl); // 디버깅 로그

          return (
            <div key={recipe.recipesId} className="recipe-card">
              <img src={imageUrl} alt={recipe.foodName} className="recipe-image" onError={(e) => (e.target.src = "/default-image.png")} />
              <div className="recipe-name">{recipe.foodName}</div>

              <div className="recipe-buttons">
                <button className="edit-btn" onClick={() => navigate(`/admin/recipes/edit/${recipe.recipesId}`)}>수정</button>
                <button className="delete-btn" onClick={() => handleDelete(recipe.recipesId)}>삭제</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminRecipes;
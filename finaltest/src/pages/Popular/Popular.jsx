import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import '../Recipes/List.css';

export default function Popular() {
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);

        // 유효하지 않은 토큰 처리 (예: 만료된 토큰)
        if (token) {
            axios.get(`http://localhost:8080/api/recipes`)
                .then(response => {
                    setRecipes(response.data);
                })
                .catch(error => {
                    console.log("데이터를 불러오는 중 오류 발생:", error);
                    alert("토큰이 만료되었거나 유효하지 않습니다.");
                    localStorage.removeItem('token');
                    setToken(null);  // 토큰 상태 초기화
                });
                axios.get(`http://localhost:8080/api/recipes/favorites`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(response => {
                    const favoritesData = response.data.favorites;  // response.data.favorites 확인
                    const favoritesObj = {};
                    favoritesData.forEach(recipe => {
                        favoritesObj[recipe.recipesId] = true;
                    });
                    setFavorites(favoritesObj);
                })
                .catch(error => {
                    console.log("즐겨찾기 정보를 불러오는 중 오류 발생:", error);
                    alert("즐겨찾기 정보를 불러오는 데 실패했습니다.");
                });
            } else {
                // 토큰이 없으면 즐겨찾기 정보를 초기화
                setFavorites({});
            }
    }, []);

    useEffect(() => {
        const fetchRecipes = () => {
            axios.get(`http://localhost:8080/api/recipes/popular`)
                .then(response => {
                    setRecipes(response.data);
                })
                .catch(error => {
                    console.log("오류 발생", error);
                });
        };
        fetchRecipes();
    }, []);




    const handleClick = (recipesId) => {
        axios.put(`http://localhost:8080/api/recipes/${recipesId}/increase-view`)
            .then(response => {
                console.log("조회수 증가 : ", response.data);
            })
            .catch(error => {
                console.log("에러", error);
            });
    }

    const handleFavorite = (recipesId) => {
        if (!token) {
            alert("로그인이 필요합니다!");  // 로그인되지 않았을 때 알림
            return;
        }

        const isCurrentlyFavorite = favorites[recipesId];
        const method = isCurrentlyFavorite ? 'DELETE' : 'POST';

        axios({
            method: method,
            url: `http://localhost:8080/api/recipes/${recipesId}/favorite`,
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                console.log(isCurrentlyFavorite ? "즐겨찾기 삭제 성공" : "즐겨찾기 추가 성공", response);
                setFavorites(prev => ({ ...prev, [recipesId]: !isCurrentlyFavorite }));
            })
            .catch(error => {
                console.log(isCurrentlyFavorite ? "즐겨찾기 삭제 실패" : "즐겨찾기 추가 실패", error);
                alert("즐겨찾기 작업에 실패했습니다.");
            });
    }

    return (
        <div className="recipe-main">
            <h1>인기 레시피</h1>
            <div className="recipe-grid">
                {recipes.slice(0, visibleCount).map((recipe) => (
                    <div key={recipe.recipesId} className="recipe-card">
                        <Link to={`/list/${recipe.recipesId}`} onClick={() => handleClick(recipe.recipesId)}>
                            <img src={recipe.foodImg} alt={recipe.foodName} />
                        </Link>
                        <h3>{recipe.foodName}</h3>
                        <div className="recipe-grid-btn">
                            <a onClick={() => handleFavorite(recipe.recipesId)}>
                                {favorites[recipe.recipesId] ? '★' : '☆'}
                            </a>
                            <p>👀조회수 : {recipe.view}</p>
                        </div>
                    </div>
                ))}
            </div>
            {visibleCount < recipes.length && (
                <button className="load-more" onClick={() => setVisibleCount(visibleCount + 6)}>
                    더보기
                </button>
            )}
        </div>
    );
}

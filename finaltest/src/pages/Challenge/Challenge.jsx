import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";




export default function Challenge(){
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [visibleCount, setVisibleCount] = useState(6);
    const [favorites, setFavorites] = useState({});
    const [isSearching, setIsSearching] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token')); 
    const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
        
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ko-KR';
    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
        
    
        // 유효하지 않은 토큰 처리 (예: 만료된 토큰)
        if (token) {
            axios.get(`http://localhost:8080/api/userrecipes`)
                .then(response => {
                    setRecipes(response.data);
                })
                .catch(error => {
                    console.log("데이터를 불러오는 중 오류 발생:", error);
                    alert("토큰이 만료되었거나 유효하지 않습니다.");
                    localStorage.removeItem('token');
                    setToken(null);  // 토큰 상태 초기화
                });
                axios.get(`http://localhost:8080/api/userrecipes/favorites`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(response => {
                    const favoritesData = response.data.favorites;  // response.data.favorites 확인
                    const favoritesObj = {};
                    favoritesData.forEach(recipe => {
                        favoritesObj[recipe.userRecipesId] = true;
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
            axios.get('http://localhost:8080/api/userrecipes') // axios GET 요청
                .then(response => {
                    console.log(response.data);
                    setRecipes(response.data); // 데이터 상태 설정
                })
                .catch(error => {
                    console.error("데이터를 불러오는 중 오류 발생:", error);
                });
        };
        fetchRecipes();
    }, []);

    

    const handleClick = (userRecipesId) =>{
        console.log("클릭된 레시피 ID: ", userRecipesId); 
        axios.put(`http://localhost:8080/api/userrecipes/${userRecipesId}/increase-view`)
        .then(response =>{
            console.log("조회수 증가 : ", response.data);

        })
        .catch(error =>{
            console.log("에러", error);
            
        })
    }

    const handleFavorite = (userRecipesId) => {
        if (!token) {
            alert("로그인이 필요합니다!");  // 로그인되지 않았을 때 알림
            return;
        }

        const isCurrentlyFavorite = favorites[userRecipesId];
        const method = isCurrentlyFavorite ? 'DELETE' : 'POST';
      
        
        axios({ 
            method : method, 
            url : `http://localhost:8080/api/userrecipes/${userRecipesId}/favorites`, 
            headers: { 'Authorization': `Bearer ${token}` } 
        })
            .then(response => {
                console.log(isCurrentlyFavorite ? "즐겨찾기 삭제 성공" : "즐겨찾기 추가 성공", response);
                setFavorites(prev =>{
                    console.log("이전 상태:", prev); // 이전 상태 확인
                    const updatedFavorites = { ...prev, [userRecipesId]: !isCurrentlyFavorite };
                    console.log("업데이트된 상태:", updatedFavorites);
                    return updatedFavorites
                })
            })
            .catch(error => {
                console.log(isCurrentlyFavorite ? "즐겨찾기 삭제 실패" : "즐겨찾기 추가 실패", error);
                alert("즐겨찾기 작업에 실패했습니다.");
            });
    }

    const handleSearch = () => {
        let searchUrl = `http://localhost:8080/api/userrecipes/search?query=${query}&category=${category}`;
            setIsSearching(true); // 검색 시작
    
        axios.get(searchUrl)
            .then(response => {
                console.log("검색 결과:", response.data);
                setRecipes(response.data); // 검색 결과만 표시
            })
            .catch(error => {
                console.log("에러:", error);
                setRecipes([]); // 검색 실패 시 목록 비우기
            });
    };

    const startVoiceSearch = ()=>{
        if (!category) {
            alert("카테고리를 선택해 주세요.");
            return;
        }

        if (isVoiceSearchActive) {
            recognition.stop();
            setIsVoiceSearchActive(false);
        } else {
            recognition.start();
            setIsVoiceSearchActive(true);
        }
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const cleanedText = transcript.replace(/\.$/, '');
        setQuery(cleanedText);
        handleVoiceSearch(cleanedText);

        recognition.stop();
        setIsVoiceSearchActive(false);
    };

    const handleVoiceSearch = (recognizedText) =>{
        const searchUrl = `http://localhost:8080/api/userrecipes/search?query=${recognizedText}&category=${category}`;
        axios.get(searchUrl)
            .then(response =>{
                setRecipes(response.data);
            })
            .catch(error =>{
                console.log("검색 오류 :", error);
                setRecipes([]);
            });
    };

    return (
        <div className="recipe-main">
            <h1>맛있는 도전</h1>
            <div className='recipe-search'>
                <button onClick={startVoiceSearch}> {isVoiceSearchActive ? "🔴 인식 중" : "🎤 시작"}</button>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">분류 선택</option>
                    <option value="음식명">음식명</option>
                    <option value="재료">재료</option>
                </select>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e)=> e.key === 'Enter' && handleSearch()}
                    placeholder="검색어 입력..."
                    disabled={!category}
                />
                <button onClick={handleSearch} disabled={!category}>검색</button>
            </div>
            
            {isSearching && recipes.length === 0? (<p>검색 결과가 없습니다.</p>) :
            (
            <div className="recipe-grid">
                {recipes.slice(0, visibleCount).map((recipe) => (
                    <div key={recipe.userRecipesId} 
                    className="recipe-card"
                    >
                        <Link to={`/challenge/${recipe.userRecipesId}`} 
                        onClick={()=> { handleClick(recipe.userRecipesId)}}>
                        <img  src={`http://localhost:8080/uploads/${recipe.foodImg}`} alt={recipe.foodName}/>
                        </Link>  
                        <h3>{recipe.foodName}</h3>
                        <div className="recipe-grid-btn">
                        <a onClick={()=> handleFavorite(recipe.userRecipesId)}>{favorites[recipe.userRecipesId]?'★':'☆'}</a>
                        <p>👀조회수 : {recipe.view}</p>
                        </div>
                    </div>
                ))}
            </div>
            )}
            {visibleCount < recipes.length && (
                <button className="load-more" onClick={() => setVisibleCount(visibleCount + 6)}>
                    더보기
                </button>
            )}
            
        </div>
    );
}
    
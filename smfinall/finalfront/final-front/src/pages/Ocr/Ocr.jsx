import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './ocr.css';

export default function Ocr() {
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [visibleCount, setVisibleCount] = useState(6);
    const [ocrText, setOcrText] = useState('');  // OCR 텍스트 저장
    const [file, setFile] = useState(null);
    const [imagePath, setImagePath] = useState('');
    const [message, setMessage] = useState('');

    // 전체 레시피 불러오기
    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);

        if (token) {
            axios.get(`http://localhost:8080/api/recipes`)
                .then(response => {
                    setRecipes(response.data);
                })
                .catch(error => {
                    console.log("데이터를 불러오는 중 오류 발생:", error);
                    alert("토큰이 만료되었거나 유효하지 않습니다.");
                    localStorage.removeItem('token');
                    setToken(null);
                });

            axios.get(`http://localhost:8080/user/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => {
                    const favoritesData = response.data.favorites;
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
            setFavorites({});
        }
    }, []);

    // OCR 파일 업로드 처리
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/api/ocr/extract-text', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setImagePath(response.data.imagePath);
            
            const ocrData = response.data.ocrData;
            const extractedText = ocrData?.titleText || '';
            
            setOcrText(extractedText);  // OCR 텍스트 상태 업데이트

            setMessage('파일 업로드 및 OCR 처리 성공!');
        } catch (error) {
            setMessage('업로드 중 오류 발생: ' + error.message);
            console.error(error);
        }
    };

    // OCR 텍스트로 레시피 필터링
    const filteredRecipes = recipes.filter(recipe =>
        recipe.foodName.toLowerCase().includes(ocrText.toLowerCase())  // OCR 텍스트로 검색
    );

    // 조회수 증가
    const handleClick = (recipesId) => {
        axios.put(`http://localhost:8080/api/recipes/${recipesId}/increase-view`)
            .then(response => {
                console.log("조회수 증가 : ", response.data);
            })
            .catch(error => {
                console.log("에러", error);
            });
    };

    // 즐겨찾기 추가/삭제
    const handleFavorite = (recipesId) => {
        if (!token) {
            alert("로그인이 필요합니다!");
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
    };

    return (
        <div className="ocrrecipebig">
            <div className="ocrrecipe">
                <h1 className="big-title">냉장고 털이</h1>
                <div className="ocr-p">
                    냉장고 속 애매한 재료들, 어떻게 활용할지 고민되시나요? 사진 한 장만 찍으면, 해당 재료를 활용한 최적의 레시피를 추천해드립니다!
                </div>
                <div className="ocrup">
                  <input type="file" onChange={handleFileChange} className="ocrinput"/>
                  <button onClick={handleUpload} className="ocrb">검색</button>
                  {ocrText && (
                    <div>
                      <p className="ocr-pp">{ocrText}가 들어간 레시피 🔍</p> {/* OCR 텍스트만 표시 */}
                    </div>
                  )}
                </div>
            </div>
            <div className="recipe-grid">
                {filteredRecipes.slice(0, visibleCount).map((recipe) => (
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
            {visibleCount < filteredRecipes.length && (
                <button className="load-more" onClick={() => setVisibleCount(visibleCount + 6)}>
                    더보기
                </button>
            )}
        </div>
    );
}

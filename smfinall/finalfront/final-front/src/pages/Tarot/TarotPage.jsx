import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/TarotPage.css";
import { Link } from 'react-router-dom';
import { TbPlayCardStarFilled } from "react-icons/tb";

const TarotPage = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [recommendedRecipe, setRecommendedRecipe] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

          
  const handleClick = (recipesId) =>{
    console.log("클릭된 레시피 ID: ", recipesId); 
    axios.put(`http://localhost:8080/api/recipes/${recipesId}/increase-view`)
    .then(response =>{
        console.log("조회수 증가 : ", response.data);

    })
    .catch(error =>{
        console.log("에러", error);
        
    })
    }
  // ⭐ 초기 카드 4장 불러오기
  const fetchRandomCards = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/tarot/cards", {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 인증 토큰 포함
        },
      });
      setCards(response.data);
    } catch (error) {
      console.error("❌ 카드 목록 가져오기 실패:", error);
      setErrorMessage("타로 카드를 불러오는 데 실패했어요 😢");
    }
  };

  // ⭐ 카드 선택 처리
  const handleCardSelection = async (cardId) => {
    if (selectedCard) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8080/tarot/select?tarotCardId=${cardId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ 선택된 카드:", response.data.selectedCard);
      setSelectedCard(response.data.selectedCard);
      setRecommendedRecipe(response.data.randomRecipe);
    } catch (error) {
      console.error("❌ 카드 선택 실패:", error);
      const message = error.response?.data || "카드 선택 중 오류가 발생했어요 😥";
      setErrorMessage(message);
    }
  };

  useEffect(() => {
    fetchRandomCards(); // 페이지 로드시 실행
  }, []);

  return (
    <div className="tarot-container">
      {errorMessage && <p className="error-text">{errorMessage}</p>}

      {/* 🎴 카드 선택 전 */}
      {!selectedCard && (
        <>
          <h1 className="pick-message">🌙 카드를 한 장 뽑아주세요 🌙</h1>
          <div className="card-grid">
            {cards.map((card) => (
              <img
                key={card.id}
                src={`http://localhost:8080/uploads/card-back.jpg`}
                alt="타로카드 뒷면"
                className="tarot-card"
                onClick={() => handleCardSelection(card.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* 🔮 카드 선택 후 결과 */}
      {selectedCard && (
        <div className="result-box">
          <h1 className="pick-message">당신이 뽑은 카드는 
            <br/>✨ {selectedCard.name} ✨</h1>
          <img
            src={
              selectedCard.imageUrl
                ? `http://localhost:8080/uploads/${selectedCard.imageUrl}`
                : "/images/default-card.jpg" // 기본 이미지 경로
            }
            alt={selectedCard.name}
            className="tarot-result-img"
            onError={(e) => {
              e.target.src = "/images/default-card.jpg";
            }}
          />
          <p className="card-description">{selectedCard.description}</p>

          {recommendedRecipe && (
            <div className="recommended-recipe">
                <h2 className="ta-ti">🍽️ 이 카드를 뽑은 당신에게 이 레시피를 추천해요 🍽️</h2>
                <img
                src={`http://localhost:8080/uploads/${recommendedRecipe.imageUrl}`}
                alt={recommendedRecipe.name}
                className="recipe-img"
                />
                <p className="recipe-name">{recommendedRecipe.name}</p>
                <Link to={`/list/${recommendedRecipe.recipesId}`} onClick={()=> { handleClick(recommendedRecipe.recipesId)}}>레시피 보러가기</Link>
            </div>
            )}
        </div>
      )}
    </div>
  );
};

export default TarotPage;
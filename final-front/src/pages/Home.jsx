import { FaCloud, FaCloudRain, FaSnowflake, FaSun } from "react-icons/fa";
import './Home.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import banner from '../assets/banner.jpg';

export default function Home() {
  const [weather, setWeather] = useState({});
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]); // 인기 레시피 추가
  const [latestRecipes, setLatestRecipes] = useState([]); // 최신 레시피 추가
  const [currentDate, setCurrentDate] = useState(""); // currentDate 상태 추가
  const [typeRecipes, setTypeRecipes] = useState([]); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [userName, setUserName] = useState(null); // 사용자 이름

  useEffect(() => {
    const token = localStorage.getItem("token"); // localStorage에서 토큰을 가져옵니다.
    if (token) {
      const username = getUserNameFromToken(token); // 토큰에서 사용자 이름을 추출합니다.
      if (username) {
        setUserName(username); // 사용자 이름을 상태에 저장
        setIsLoggedIn(true); // 로그인 상태로 설정
      } else {
        setIsLoggedIn(false); // 사용자 이름이 없으면 로그인 상태 아님
      }
    } else {
      setIsLoggedIn(false); // 토큰이 없으면 로그인 상태 아님
    }

    // 현재 날짜 설정
    const now = new Date();
    setCurrentDate(now.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    }));
  }, []);

  function getUserNameFromToken(token) {
    if (!token) return null; // 토큰이 없으면 null 반환
    
    try {
      // Base64 URL 디코딩 (패딩 추가)
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      
      // 디코딩된 JSON을 객체로 변환
      const decodedToken = JSON.parse(atob(base64));
      
      // 'sub' 필드에서 사용자 이름 추출 (백엔드에서 sub 필드에 사용자 이름을 저장한다고 가정)
      return decodedToken.sub; // JWT의 'sub' 필드가 사용자 이름을 포함
    } catch (error) {
      console.error("토큰 디코딩 오류:", error);
      return null;
    }
  }

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = '00';

        const response = await axios.get('http://localhost:8080/api/weather', {
          params: {
            baseDate: `${year}${month}${date}`,
            baseTime: `${hours}${minutes}`,
            nx: 60,
            ny: 127,
          },
          responseType: 'text'
        });

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, 'text/xml');
        const items = xmlDoc.getElementsByTagName('item');
        const weatherData = {};

        for (let i = 0; i < items.length; i++) {
          const category = items[i].getElementsByTagName('category')[0].textContent;
          const value = items[i].getElementsByTagName('obsrValue')[0].textContent;

          if (category === 'T1H') {
            weatherData.temperature = `${value}°C`;
          } else if (category === 'PTY') {
            weatherData.precipitation = value;
          }
        }

        if (weatherData.precipitation === '0') {
          weatherData.precipitation = '맑음';
        } else if (weatherData.precipitation === '1') {
          weatherData.precipitation = '비';
        } else if (weatherData.precipitation === '2') {
          weatherData.precipitation = '흐림';
        } else if (weatherData.precipitation === '3') {
          weatherData.precipitation = '눈';
        }

        setWeather(weatherData);
        setError(null);
        const recipeResponse = await axios.get('http://localhost:8080/api/weather/recipe', {
          params: { precipitation: weatherData.precipitation }
        });
        setRecipes(recipeResponse.data);

        // 인기 레시피 가져오기
        const popularResponse = await axios.get('http://localhost:8080/api/main/popular');
        setPopularRecipes(popularResponse.data);

        // 최신 레시피 가져오기
        const latestResponse = await axios.get('http://localhost:8080/api/main/recent');
        setLatestRecipes(latestResponse.data);

        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get('http://localhost:8080/api/main/recommend', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setTypeRecipes(response.data);
        }

      } catch (error) {
        setError("날씨 정보를 가져오는 데 실패했습니다.", error);
      }
    };
    fetchWeather();
  }, []);

  const renderWeatherIcon = (precipitation) => {
    switch (precipitation) {
      case '맑음':
        return <FaSun className='icon-sunny' />;
      case '비':
        return <FaCloudRain className='icon-rain' />;
      case '흐림':
        return <FaCloud className='icon-cloud' />;
      case '눈':
        return <FaSnowflake className='icon-snow' />;
      default:
        return null;
    }
  };

  const handleClick = (recipeId) => {
    console.log("클릭된 레시피 ID: ", recipeId);
    axios.put(`http://localhost:8080/api/recipes/${recipeId}/increase-view`)
      .then(response => {
        console.log("조회수 증가 : ", response.data);
      })
      .catch(error => {
        console.log("에러", error);
      });
  };

  return (
    <div className="home">
      <Link to={'/'}>
        <img
          src={banner}
          alt="banner"
          style={{ borderRadius: '15px', marginTop: '100px' }}
          className="tarobanner"
        />
      </Link>
  
      <h2 className="small-title">☀️ 오늘의 날씨에 어울리는 레시피! 🌧️</h2>
      <div className="weather-app">
        <div>
          <div className="weather-recipe">
            {recipes.map((recipe, index) => {
              const imageUrl = `http://localhost:8080/uploads/${recipe.foodImg}`;
              console.log("[날씨레시피] foodImg:", recipe.foodImg);
              return (
                <div key={index} className="weather-recipe-card">
                  <Link to={`/list/${recipe.recipesId}`} onClick={() => handleClick(recipe.recipesId)} style={{ textDecoration: "none", color: "inherit" }}>
                    <img
                      src={imageUrl}
                      alt={recipe.foodName}
                      onError={() => console.error("❌ [날씨레시피] 이미지 로딩 실패:", imageUrl)}
                    />
                    <p className="homefoodename">{recipe.foodName}</p>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
  
        <div className="weather">
          <div className="weather-head">
            <h3>Today</h3>
            <p>{currentDate}</p>
          </div>
          <div className="weather-card">
            {error && <p className="error">{error}</p>}
            {Object.keys(weather).length > 0 && (
              <p>{weather.temperature} {weather.precipitation} {renderWeatherIcon(weather.precipitation)}</p>
            )}
          </div>
        </div>
      </div>
  
      <h2 className="small-title">🔥 베스트 레시피 🔥</h2>
      <div className="best-recipe">
        {popularRecipes.map((recipe, index) => {
          console.log("[인기레시피] foodImg:", recipe.foodImg);
          return (
            <div key={index} className="weather-recipe-card">
              <Link to={`/list/${recipe.recipesId}`} onClick={() => handleClick(recipe.recipesId)} style={{ textDecoration: "none", color: "inherit" }}>
                <img
                  src={`http://localhost:8080/uploads/${recipe.foodImg}`}
                  alt={recipe.foodName}
                  onError={() => console.error("❌ [인기레시피] 이미지 로딩 실패:", recipe.foodImg)}
                />
                <p className="homefoodename">{recipe.foodName}</p>
              </Link>
            </div>
          );
        })}
      </div>
  
      <h2 className="small-title">🆕 새로 나온 레시피 🆕</h2>
      <div className="new-recipe">
        {latestRecipes.map((recipe, index) => {
          console.log("[최신레시피] foodImg:", recipe.foodImg);
          return (
            <div key={index} className="weather-recipe-card">
              <Link to={`/list/${recipe.recipesId}`} onClick={() => handleClick(recipe.recipesId)} style={{ textDecoration: "none", color: "inherit" }}>
                <img
                  src={`http://localhost:8080/uploads/${recipe.foodImg}`}
                  alt={recipe.foodName}
                  onError={() => console.error("❌ [최신레시피] 이미지 로딩 실패:", recipe.foodImg)}
                />
                <p className="homefoodename">{recipe.foodName}</p>
              </Link>
            </div>
          );
        })}
      </div>
  
      {isLoggedIn && (
        <>
          <h2 className="small-title">🧡{userName}님이 좋아할만한 레시피 🧡</h2>
          <div className="type-recipe">
            {typeRecipes.length > 0 ? (
              typeRecipes.map((recipe, index) => {
                console.log("[추천레시피] foodImg:", recipe.foodImg);
                return (
                  <div key={index} className="weather-recipe-card">
                    <Link to={`/list/${recipe.recipesId}`} onClick={() => handleClick(recipe.recipesId)}>
                      <img
                        src={`http://localhost:8080/uploads/${recipe.foodImg}`}
                        alt={recipe.foodName}
                        onError={() => console.error("❌ [추천레시피] 이미지 로딩 실패:", recipe.foodImg)}
                      />
                      <p className="homefoodename">{recipe.foodName}</p>
                    </Link>
                  </div>
                );
              })
            ) : (
              <p>회원님의 관심 목록을 기반으로 제공되는 서비스입니다. 관심 목록에 레시피를 추가해보세요!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

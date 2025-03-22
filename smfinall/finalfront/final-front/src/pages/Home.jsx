import { FaCloud, FaCloudRain, FaSnowflake, FaSun } from "react-icons/fa";
import './Home.css'
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import banner from '../assets/banner.jpg'

export default function Home(){
    const [weather, setWeather] = useState({});
    const [error, setError] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [currentDate, setCurrentDate] = useState("");

    useEffect(()=>{
      const now = new Date();
      setCurrentDate(now.toLocaleDateString("ko-KR",{
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
      }));
    })

    useEffect(() => {
        const fetchWeather = async () => {
          try {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = '00';
    
            const response = await axios.get('http://localhost:8080/api/weather', {
              params: {
                baseDate: `${year}${month}${date}`, // 현재 날짜
                baseTime:`${hours}${minutes}`, // 현재 시간
                nx: 60, // 서울의 nx 값
                ny: 127, // 서울의 ny 값
              },
              responseType: 'text'
            });
    
            // XML 문자열 파싱
            console.log(response.data); // 응답 로그 추가
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, 'text/xml');
    
            // 현재 기온, 습도, 날씨 상태 추출
            const items = xmlDoc.getElementsByTagName('item');
            const weatherData = {};
    
            for (let i = 0; i < items.length; i++) {
              const category = items[i].getElementsByTagName('category')[0].textContent;
              const value = items[i].getElementsByTagName('obsrValue')[0].textContent;
    
              if (category === 'T1H') {
                weatherData.temperature = `${value}°C`;
              } else if (category === 'PTY'){
                weatherData.precipitation = value;    // 강수 형태 
              }
            }
    
            // 강수 형태가 0일 경우의 처리 (예: 비 없음)
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
          } catch (error) {
            setError("날씨 정보를 가져오는 데 실패했습니다.", error);
          }
        };
        fetchWeather();
      }, []);

      
      const renderWeatherIcon = (precipitation) => {
        switch (precipitation) {
          case '맑음':
            return <FaSun className='icon-sunny'/>;
          case '비':
            return <FaCloudRain className='icon-rain'/>;
          case '흐림':
            return <FaCloud className='icon-cloud'/>;
          case '눈':
            return <FaSnowflake className='icon-snow'/>;
          default:
            return null;
        }
      };

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
    
    return(  
        <div className="home">
           <Link to={'/'}>
            <img 
              src={banner} 
              alt="banner" 
              style={{ borderRadius: '15px', marginTop:'100px'}} // 여기서 border-radius 값을 원하는 대로 설정
            />
          </Link>
            <div className="weather-app">
              <div>
              <h3>추천 레시피</h3>
                    <div className="weather-recipe">
                        {recipes.map((recipe, index) => (
                          <div key={index} className="weather-recipe-card">
                            <Link to={`/list/${recipe.recipesId}`} onClick={()=> { handleClick(recipe.recipesId)}}>
                              <img src={recipe.foodImg} alt={recipe.foodName}/>
                              <p>{recipe.foodName}</p>
                            </Link>
                          </div>
                        ))}
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
                <p>{weather.temperature} {weather.precipitation} {renderWeatherIcon(weather.precipitation)}  </p>
                )}
                </div>
              </div>
            </div>
        </div>
          
    )
}
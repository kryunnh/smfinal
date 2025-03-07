import { FaCloud, FaCloudRain, FaSnowflake, FaSun } from "react-icons/fa";
import './Home.css'
import axios from "axios";
import { useEffect, useState } from "react";


export default function Home(){
    const [weather, setWeather] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
          try {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
    
            const response = await axios.get('http://localhost:8080/api/weather', {
              params: {
                baseDate: `${year}${month}${date}`, // 현재 날짜
                baseTime:`${hours}${minutes}`, // 현재 시간
                nx: 60, // 서울의 nx 값
                ny: 127, // 서울의 ny 값
                authKey: 'DzckNPKXTjK3JDTyl24yJg' // 기상청 API 키 입력
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
          } catch (error) {
            setError("날씨 정보를 가져오는 데 실패했습니다.",error);
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


    return(  
        <div>
            <h1>Welcome to the Recipe App</h1>
            <div className="weather-app">
                <p>오늘의 날씨에 어울리는 레시피</p>
                {error && <p className="error">{error}</p>}
                {Object.keys(weather).length > 0 && (
                <p> 온도: {weather.temperature} {weather.precipitation} {renderWeatherIcon(weather.precipitation)}  </p>
                )}
            </div>
        </div>
          
    )
}
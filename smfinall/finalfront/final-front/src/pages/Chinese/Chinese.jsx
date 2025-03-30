import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import '../Recipes/List.css';
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaMicrophoneLines } from "react-icons/fa6";



export default function Chinese(){
    const [recipes, setRecipes] = useState([]);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);
    const [favorites, setFavorites] = useState({});
    const [isSearching, setIsSearching] = useState(false);
    const [filteredRecipes, setFilteredRecipes] = useState([]); 
    const [token, setToken] = useState(localStorage.getItem('token')); 
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [commentCounts, setCommentCounts] = useState({});

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ko-KR';
      //top으로 이동
      const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
        
    
        // 유효하지 않은 토큰 처리 (예: 만료된 토큰)
        if (token) {
            axios.get(`http://localhost:8080/api/recipes`)
                .then(response => {
                    setFilteredRecipes(response.data);
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
            axios.get('http://localhost:8080/api/recipes') 
                .then(response => {
                    console.log(response.data);
                    const chineseRecipes = response.data.filter(recipe => recipe.categoryName === '중식');
                    setFilteredRecipes(chineseRecipes);
                })
                .catch(error => {
                    console.error("데이터를 불러오는 중 오류 발생:", error);
                });
        };
        fetchRecipes();
    }, []);

    

    const handleClick = (recipesId) =>{
        axios.put(`http://localhost:8080/api/recipes/${recipesId}/increase-view`)
        .then(response =>{
            console.log("조회수 증가 : ", response.data);
        })
        .catch(error =>{
            console.log("에러", error);
        })
    }

    const handleFavorite = (recipesId) => {
        if (!token) {
            alert("로그인이 필요합니다!");  // 로그인되지 않았을 때 알림
            return;
        }

        const isCurrentlyFavorite = favorites[recipesId];
        const method = isCurrentlyFavorite ? 'DELETE' : 'POST';
      
        console.log("헤더에 포함될 토큰:", token);
        axios({ 
            method : method, 
            url : `http://localhost:8080/api/recipes/${recipesId}/favorite`, 
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

    useEffect(() => {
        if (query.trim()) {
            handleSearch(); // query가 업데이트된 후에 검색이 실행되도록
        }
    }, [query]); // query가 변경될 때마다 실행

    const handleSearch = () => {
        if (!category) {
            console.log("카테고리가 비어 있음");
            alert("카테고리를 선택해 주세요.");
            return;
        }
        

        let searchUrl = `http://localhost:8080/api/recipes/search?query=${query}&category=${category}`;
            setIsSearching(true); // 검색 시작

        axios.get(searchUrl)
            .then(response => {
                console.log("검색 결과:", response.data);
                setFilteredRecipes(response.data); // 검색 결과만 표시
            })
            .catch(error => {
                console.log("에러:", error);
                setFilteredRecipes([]); // 검색 실패 시 목록 비우기
            });
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
    
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
    
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                const formData = new FormData();
                formData.append("file", audioBlob, "recorded_audio.wav");
    
                try {
                    // 네이버 클로바 음성 인식 API에 파일 전송
                    const response = await axios.post("http://localhost:8080/api/recognize-speech", formData, {
                        headers: {
                            "Content-Type": "application/octet-stream", 
                        }
                    });
    
                    const recognizedText = response.data.text;
                    console.log("음성 인식 결과:", recognizedText);
                    setQuery(recognizedText); // 음성 인식 결과로 검색어 업데이트

            


                } catch (error) {
                    console.log("음성 인식 오류:", error);
                    alert("음성 인식 실패했습니다.");
                }
            };

            
            mediaRecorder.start();
            setIsRecording(true);
            
            setTimeout(() => {
                handleSearch();
                stopRecording();
            }, 3000); // 예시로 4초 후 자동 종료
            
        } catch (error) {
            console.log("마이크 오류 : ", error);
            alert("마이크 문제");
        }
    };
    
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
   const fetchCommentCount = async (recipeId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/recipe/review/count/${recipeId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();  // JSON 데이터 가져오기
            console.log(`🔍 recipeId: ${recipeId}, 댓글 수: ${data.count}`);
            return data.count;  // 댓글 수 반환
        } catch (error) {
            console.error("댓글 수 가져오기 실패:", error);
            return 0; // 오류 발생 시 0으로 반환
        }
    };

    useEffect(() => {
        const fetchAllComments = async () => {
            const counts = {};
            for (const recipe of recipes) {
                counts[recipe.recipesId] = await fetchCommentCount(recipe.recipesId);
            }
            console.log("댓글 데이터:", counts); 
            setCommentCounts(counts);
        };
    
        if (recipes.length > 0) {
            fetchAllComments();
        }
    }, [recipes]);

    return (
        <div className="recipes-main">
            <h1 className="big-title">일식</h1>
            <div className='recipes-search'>
            <button className="speaker" onClick={ ()=>{if(!category){alert("카테고리를 선택해 주세요."); return;} isRecording ? stopRecording() : startRecording()}} disabled={false}>
                    {isRecording ? "🔴 인식 중" : <FaMicrophoneLines />}
                </button>
                <select  style={{fontFamily:"NEXON Lv1 Gothic OTF"}} value={category} onChange={(e) => setCategory(e.target.value)}>
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
                    style={{fontFamily:"NEXON Lv1 Gothic OTF"}}
                />
                <button  className="rc-se" style={{fontFamily:"NEXON Lv1 Gothic OTF"}} onClick={ ()=>{if(!category){alert("카테고리를 선택해 주세요."); return;} handleSearch()}} disabled={false}>검색</button>
            </div>
            
            {isSearching && filteredRecipes.length === 0? (<p>검색 결과가 없습니다.</p>) :
            (
            <div className="recipes-grid">
                { filteredRecipes.slice(0, visibleCount).map((recipe) => (
                    <div key={recipe.recipesId} 
                    className="recipes-card"
                    >
                        <Link to={`/list/${recipe.recipesId}`} onClick={()=>handleClick(recipe.recipesId)}>
                        <img  className="rc-list-img" src={`http://localhost:8080/uploads/api/userrecipes/${recipe.foodImg}`} alt={recipe.foodName}/>
                        </Link>  
                        <h3 className="rc-fn">{recipe.foodName}</h3>
                        <div className="recipes-grid-btn" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <a onClick={() => handleFavorite(recipe.recipesId)}>
                            {favorites[recipe.recipesId] ? <FaStar size={24} color="gold" /> : <FaRegStar />}
                        </a>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <p>💬 {commentCounts[recipe.recipesId]}</p>
                            <p>👀 {recipe.view}</p>
                        </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
            {visibleCount < filteredRecipes.length && (
                <button className="load-more" onClick={() => setVisibleCount(visibleCount + 6)}>
                    더보기
                </button>
            )}
               <button onClick={scrollToTop} className="totop">🔝</button>
        </div>
    );
}
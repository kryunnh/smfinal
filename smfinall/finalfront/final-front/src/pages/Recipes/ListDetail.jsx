import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import './ListDetail.css'
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";

export default function ListDetail(){
    const {id} = useParams();
    const [selectRecipes, setSelectRecipes] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]); 
    const [review, setReview] = useState([]);
    const [content, setContent] = useState(""); 
    const [rating, setRating] = useState(0); 
    const [token, setToken] = useState(localStorage.getItem('token')); 
    const [editReviewId, setEditReviewId] = useState(null); 
    const [editContent, setEditContent] = useState(""); 
    const [editRating, setEditRating] = useState(0);
    const [favorites, setFavorites] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    
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

        const handleFavorite = (recipesId) => {
            if (!token) {
                alert("로그인이 필요합니다!");  // 로그인되지 않았을 때 알림
                return;
            }
    
            const isCurrentlyFavorite = favorites[recipesId];
            const method = isCurrentlyFavorite ? 'DELETE' : 'POST';
          
            
            axios({ 
                method : method, 
                url : `http://localhost:8080/api/recipes/${recipesId}/favorite`, 
                headers: { 'Authorization': `Bearer ${token}` } 
            })
                .then(response => {
                    console.log(isCurrentlyFavorite ? "즐겨찾기 삭제 성공" : "즐겨찾기 추가 성공", response);
                    setFavorites(prev =>{
                        console.log("이전 상태:", prev); // 이전 상태 확인
                        const updatedFavorites = { ...prev, [recipesId]: !isCurrentlyFavorite };
                        console.log("업데이트된 상태:", updatedFavorites);
                        return updatedFavorites
                    })
                })
                .catch(error => {
                    console.log(isCurrentlyFavorite ? "즐겨찾기 삭제 실패" : "즐겨찾기 추가 실패", error);
                    alert("즐겨찾기 작업에 실패했습니다.");
                });
        }

    useEffect(()=>{
        const token = localStorage.getItem('token');
        setToken(token);
        

        if(token){
            axios.get(`http://localhost:8080/api/recipes`)
            .then(response=>{
                setRecipes(response.data);
            })
            .catch(error =>{
                console.log("오류",error);
                localStorage.removeItem('token');
                setToken(null);
            });
        }
    },[])
    
   
  //top으로 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  
    useEffect(() => {
        const fetchRecipes = () => {
            axios.get('http://localhost:8080/api/recipes') 
                .then(response => {
                    setRecipes(response.data); 
                })
                .catch(error => {
                    console.error("데이터를 불러오는 중 오류 발생:", error);
                });
        };
        fetchRecipes();
    }, []);

    const handleClick = (recipesId) => {
    

        axios.put(`http://localhost:8080/api/recipes/${recipesId}/increase-view`)
        .then(() => {
            // 조회수가 증가한 후, selectRecipes 상태를 업데이트하여 UI에 반영
            setSelectRecipes(prevState => ({
                ...prevState,
                view: prevState.view + 1
            }));
            window.scrollTo(0, 0);  // x, y 좌표 (0, 0)으로 스크롤
        })
        .catch(error => {
            console.log("조회수 증가 중 오류 발생:", error);
        });
    };

    useEffect(() => {
        const fetchRecipesDetail = () => {
            axios.get(`http://localhost:8080/api/recipes/${id}`)
                .then(response => {
                    setSelectRecipes(response.data);

                    if (response.data) {
                        const relatedRecipes = recipes
                            .filter(recipe => recipe.categoryName === response.data.categoryName && recipe.recipesId !== response.data.recipesId)
                            .sort(() => Math.random() - 0.5);
                        setFilteredRecipes(relatedRecipes);
                    }
                })
                .catch(error => {
                    console.error("데이터를 불러오는 중 오류 발생:", error);
                });
        };

        fetchRecipesDetail();
    }, [id, recipes]);

    const getStars = (rating) => {
        // 별을 gold 이모지로 처리, 빈 별은 gray로 처리
        const fullStars = "⭐".repeat(rating);  // 꽉 찬 별
        const emptyStars = "☆".repeat(5 - rating);  // 빈 별
        
        return (
          <span>
            {/* 꽉 찬 별에만 이모지 스타일 적용 */}
            {fullStars.split('').map((star, index) => (
              <span
                key={`full-${index}`}
                style={{
                  cursor: "pointer",
                  fontSize: "24px", // 별 크기 조정
                }}
              >
                {star}
              </span>
            ))}
            
            {/* 빈 별은 회색으로 스타일 적용 */}
            {emptyStars.split('').map((star, index) => (
              <span
                key={`empty-${index}`}
                style={{
                  cursor: "pointer",
                  color: "gray", // 빈 별은 회색으로
                  fontSize: "24px", // 별 크기 조정
                }}
              >
                {star}
              </span>
            ))}
          </span>
        );
      };
      
     const handlePurchase = (ingredientName) =>{
         const searchUrl = `https://www.coupang.com/np/search?q=${encodeURIComponent(ingredientName)}`;
         window.open(searchUrl, '_blank');
     }
     
     const handleStarClick = (index) => {
         setRating(index + 1); 
        };


        useEffect(()=>{
            axios.get(`http://localhost:8080/api/recipes/review/${id}`)
            .then(response =>{
                setReview(response.data);
            })
            .catch(error=>{
                console.error("데이터를 불러오는 중 오류 발생:", error);
            })
            
        },[id])
    
    const handleReviewSubmit = () => {
        
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
        const currentTime = new Date().toISOString();
        
        const newReview = {
            reviewText : content,
            rating,
            recipesId: id,
            timestamp: currentTime,

        };
       
        axios.post(`http://localhost:8080/api/recipes/review`, newReview, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
        .then(response => {
            console.log(response.data);
            
            axios.get(`http://localhost:8080/api/recipes/review/${id}`)
                .then(response => {
                    setReview(prevReviews => [...prevReviews, response.data]);
                    setContent(""); 
                    setRating(0);
                    console.log(response.data);
                    
                })
                .catch(error => {
                    console.error("리뷰를 불러오는 중 오류 발생:", error);
                });
        })
        .catch(error => {
            console.error("리뷰 작성 중 오류 발생:", error);
        });
        
    };

    const handleEditButtonClick = (reviewId, reviewText, rating) => {
        setEditReviewId(reviewId);
        setEditContent(reviewText);
        setEditRating(rating);
    };

    const handleEditCancel = () => {
        setEditReviewId(null); // 취소 시 수정 모드 종료
        setEditContent(""); // 수정 입력 초기화
        setEditRating(0); // 별점 초기화
    };
    
    const handleEditReviewSubmit = (reviewId) => {
        const currentTime = new Date().toISOString();
        const updatedReview = {
            reviewText: editContent,
            rating: editRating,
            timestamp: currentTime,
        };

        axios.put(`http://localhost:8080/api/recipes/review/${reviewId}`, updatedReview, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then(() => {
            setReview(prevReviews => prevReviews.map(r => 
                r.reviewId === reviewId ? { ...r, reviewText: editContent, rating: editRating } : r
            ));
            setEditReviewId(null); // 수정 모드 종료
            setEditContent(""); // 입력 필드 초기화
            setEditRating(0); // 별점 초기화
        })
        .catch(error => {
            console.error("리뷰 수정 중 오류 발생:", error);
        });
    };

    const handleDeleteReview = (reviewId) => {
        axios.delete(`http://localhost:8080/api/recipes/review/${reviewId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        .then(response => {
            console.log("리뷰 삭제 완료:", response.data);
            
            axios.get(`http://localhost:8080/api/recipes/review/${id}`)
                .then(() => {
                    setReview(prevReview => prevReview.filter(r => r.reviewId !== reviewId));
                })
                .catch(error => {
                    console.error("리뷰 목록 갱신 중 오류 발생:", error);
                });
        })
        .catch(error => {
            console.error("리뷰 삭제 중 오류 발생:", error);
        });
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


    return(
        <div className="recipe-detail-main">
             {selectRecipes ? (
            <>
                <div className="recipe-header">
                    <img src={`http://localhost:8080/uploads/api/userrecipes/${selectRecipes.foodImg}`} alt={selectRecipes.foodName} className="list-img"/>
                    <h1 className="recipe-detail-name">{selectRecipes.foodName}</h1>
                        <span className="recipetime" style={{color: "#5e5e5e"}}>⏱️ {selectRecipes.foodTime} 분 </span>
                        <span className="recipetime" style={{color: "#5e5e5e"}}>🔖 {selectRecipes.categoryName}</span>
                        <span style={{color: "#5e5e5e"}}>👀 {selectRecipes.view}</span>
                    <br/>
                    <div className="ingredient-table">
                        <h3 style={{ color: "#FFA575" }}>재료</h3>
                        {selectRecipes.ingredients && selectRecipes.ingredients.length > 0 ? (
                        <table className="recipe-tables">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                            <tbody>
                                {selectRecipes.ingredients.map((ingredient, index) => (
                                    index % 2 === 0 ? (
                                        <tr key={index}>
                                            <td className="recipe-detail-in-name">{ingredient.name}</td>
                                            <td>
                                                <a onClick={()=>handlePurchase(ingredient.name)}>구매하기</a>
                                            </td>
                                {selectRecipes.ingredients[index + 1] && (
                                        <>
                                            <td>{selectRecipes.ingredients[index + 1].name}</td>
                                            <td>
                                                <a onClick={()=>handlePurchase(ingredient[index+1].name)}>구매하기</a>
                                            </td>
                                        </>
                                )}
                                        </tr>
                                                    ) : null 
                                ))}
                            </tbody>
                        </table>
                        ) : (
                            <p>재료 정보가 없습니다.</p>
                        )}
                    </div>
                </div>
                <br/>
                <div>
                {[1, 2, 3, 4, 5, 6].map((step,index) => {
                            const stepImg = selectRecipes[`stepImg${step}`];
                            const stepText = selectRecipes[`step${step}`];
                            return (
                                stepImg && stepText && (
                                    <div className="recipe-step" key={step}>
                                        <div className="rs-p"> <span className="stepl-index">{index + 1}</span> {stepText}</div>
                                        <img src={`http://localhost:8080/uploads/api/userrecipes/${stepImg}`} alt={`Step ${step} image for ${selectRecipes.foodName}`} />
                                    </div>
                                )
                            );
                        })}
                </div>
            </>
            ) : (
                <div>레시피를 불러오는 중입니다...</div>
            )}
            <br/>
            <br/>
            <div className="review">
                <div className="review-head">
                <h2 className="review-head-h">요리 후기 ({commentCounts[selectRecipes?.recipesId] || 0}) </h2>
                {review.length > 0 ? (
                        <div className="review-container">
                            {review.map((r) => (
                                <div key={r.reviewId} className="reviews">
                                    <span style={{fontSize:"18px" , marginBottom:"15px"}}>{r.name}</span>
                                    &nbsp; &nbsp; &nbsp;
                                    <span>{getStars(r.rating)}</span>
                                    <p>{r.reviewText}</p>
                                    <p className="createdAt">{new Date(r.createdAt).toLocaleString()}</p>
                                    {r.email === localStorage.getItem("email") && (
                                        <div className="reivewcomment-button">
                                                <button className="comment-update" onClick={() => handleEditButtonClick(r.reviewId, r.reviewText, r.rating)}>수정</button>
                                                <button className="comment-delete" onClick={() => handleDeleteReview(r.reviewId)}>삭제</button>
                                        </div>
                                    )}
                                    <hr className="review-hr"/>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="noreview">리뷰가 없습니다.</div>
                    )}
                </div>

                {/* 리뷰 작성 폼 */}
                {token && !editReviewId ? (
                    <form onSubmit={handleReviewSubmit} >
                        <div className="review-content" style={{ width: "100%", display: "flex", alignItems: "center" }}>
                            <textarea value={content} onChange={(e) => setContent(e.target.value)} required 
                                 rows="3"
                                 style={{ borderRadius:"20px 0 0 20px", flex: "1", minHeight: "50px", resize: "vertical", padding:"20px", fontFamily:"NEXON Lv1 Gothic OTF"}}/>
                            <button type="submit" className="comments-write" style={{borderRadius:"0 10px 10px 0"}}>작성</button>
                        </div>
                        <div className="review-rating">
                            <label>별점: </label>
                            <span className="star-rating">
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        onClick={() => handleStarClick(index)}
                                        style={{
                                            cursor: "pointer",
                                            color: index < rating ? "gold" : "gray",
                                        }}
                                    >
                                        &#9733;
                                    </span>
                                ))}
                            </span>
                        </div>
                    </form>
                ) : (
                    !token &&<p>로그인 후 리뷰를 작성할 수 있습니다.</p>
                )}
                

                {/* 리뷰 수정 폼 */}
                {editReviewId && (
                    <form onSubmit={() => handleEditReviewSubmit(editReviewId)}>
                        <div className="review-content" style={{ width: "100%", display: "flex", alignItems: "center" }}>  
                            <textarea 
                                value={editContent} 
                                onChange={(e) => setEditContent(e.target.value)} 
                                required 
                                rows="3"
                                style={{ flex: "1", minHeight: "50px", resize: "vertical" ,borderRadius:"20px 0 0 20px", padding:"20px", fontFamily:"NEXON Lv1 Gothic OTF"}}
                            />
                            <button type="submit"className="comments-write" style={{borderRadius:"0"}}>저장</button>
                            <button type="button" onClick={handleEditCancel} className="comments-deny">취소</button>
                        </div>
                        <div className="review-rating">
                            <label>별점 :</label>

                            <div className="star-rating">
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        onClick={() => setEditRating(index + 1)}
                                        style={{
                                            cursor: "pointer",
                                            color: index < editRating ? "gold" : "gray",
                                        }}
                                    >
                                        &#9733;
                                    </span>
                                ))}
                            </div>
                        </div>
                    </form>
                )}
            </div>
            <hr className="review-hr"/>
            <h2 className="review-head-h">회원님을 위한 추천 레시피</h2>
                <div className="recipes-grid">
                    {filteredRecipes.map((recipe) => (
                        <div key={recipe.recipesId} className="recipes-card">
                            <Link to={`/list/${recipe.recipesId}`} onClick={() => handleClick(recipe.recipesId)}>
                                <img className="rc-img" src={`http://localhost:8080/uploads/api/userrecipes/${recipe.foodImg}`} alt={recipe.foodName} />
                            </Link>  
                            <h3 className="rd-reco">{recipe.foodName}</h3>
                            <div className="recipes-grid-btn">
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
        </div>   
    )
}
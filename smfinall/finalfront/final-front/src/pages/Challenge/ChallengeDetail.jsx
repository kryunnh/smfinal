import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";




export default function ChallengeDetail(){
    const {id} = useParams();
    const [selectRecipes, setSelectRecipes] = useState(null);
    const [review, setReview] = useState([]);
    const [content, setContent] = useState(""); 
    const [rating, setRating] = useState(0); 
    const [token, setToken] = useState(localStorage.getItem('token')); 
    const [editReviewId, setEditReviewId] = useState(null); 
    const [editContent, setEditContent] = useState(""); 
    const [editRating, setEditRating] = useState(0);
    const [filteredRecipes, setFilteredRecipes] = useState([]); 
    const [commentCounts, setCommentCounts] = useState({});

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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    
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


    useEffect(() => {
        const fetchRecipesDetail = () => {
            axios.get(`http://localhost:8080/api/userrecipes/${id}`)
            .then(response => {
                setSelectRecipes(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error("데이터를 불러오는 중 오류 발생:", error);
            });
    };

    fetchRecipesDetail();
}, [id]);

    
     const handlePurchase = (ingredientName) =>{
         const searchUrl = `https://www.coupang.com/np/search?q=${encodeURIComponent(ingredientName)}`;
         window.open(searchUrl, '_blank');
     }
     
     const handleStarClick = (index) => {
         setRating(index + 1); 
        };


        useEffect(()=>{
            axios.get(`http://localhost:8080/api/userrecipes/review/${id}`)
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
            userRecipesId: id,
            timestamp: currentTime,

        };
       
        axios.post(`http://localhost:8080/api/userrecipes/review`, newReview, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
        .then(response => {
            console.log(response.data);
            
            axios.get(`http://localhost:8080/api/userrecipes/review/${id}`)
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

        axios.put(`http://localhost:8080/api/userrecipes/review/${reviewId}`, updatedReview, {
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
        axios.delete(`http://localhost:8080/api/userrecipes/review/${reviewId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        .then(response => {
            console.log("리뷰 삭제 완료:", response.data);
            
            axios.get(`http://localhost:8080/api/userrecipes/review/${id}`)
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
    
    const fetchCommentCount = async (userRecipesId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/userrecipe/review/count/${userRecipesId}`, {
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
            console.log(`🔍 UserrecipeId: ${userRecipesId}, 댓글 수: ${data.count}`);
            return data.count;  // 댓글 수 반환
        } catch (error) {
            console.error("댓글 수 가져오기 실패:", error);
            return 0; // 오류 발생 시 0으로 반환
        }
    };

    useEffect(() => {
        const fetchAllComments = async () => {
            const counts = {};
            if (selectRecipes && selectRecipes.userRecipesId) {
               
                counts[selectRecipes.userRecipesId] = await fetchCommentCount(selectRecipes.userRecipesId);
            }
            console.log("댓글 데이터:", counts);
            setCommentCounts(counts);
        };
    
        
        if (selectRecipes && selectRecipes.userRecipesId) {
            fetchAllComments();
        }
    }, [selectRecipes]);

    return(
        <div className="recipe-detail-main">
             {selectRecipes ? (
            <>
                <div className="recipe-header">
                    <img src={`http://localhost:8080/uploads/api/userrecipes/${selectRecipes.foodImg}`} alt={selectRecipes.foodName} className="list-img"/>
                    <h1 className="recipe-detail-name">{selectRecipes.foodName}</h1>
                        <span className="recipetime" style={{color: "#5e5e5e"}}>⏱️ {selectRecipes.foodTime} 분 </span>
                        <span className="recipetime" style={{color: "#5e5e5e"}}>👀 {selectRecipes.view}</span>
                        <span style={{color: "#5e5e5e"}}>🧑‍🍳 {selectRecipes.name}</span>
                    <br/>
                    <div className="ingredient-table">
                        <h3 style={{ color: "#FFA575" }}>재료</h3>
                        {selectRecipes.ingredientss && selectRecipes.ingredientss.length > 0 ? (
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
                                {selectRecipes.ingredientss.map((ingredient, index) => (
                                    index % 2 === 0 ? (
                                        <tr key={index}>
                                            <td className="recipe-detail-in-name">{ingredient.name}</td>
                                            <td>
                                                <a onClick={()=>handlePurchase(ingredient.name)}>구매하기</a>
                                            </td>
                                {selectRecipes.ingredientss[index + 1] && (
                                        <>
                                            <td>{selectRecipes.ingredientss[index + 1].name}</td>
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
                                        <di className="rs-p">{`${index + 1}. ${stepText}`}</di>
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
                <h2 className="review-head-h">요리 후기  ({commentCounts[selectRecipes?.recipesId] || 0})</h2>
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
        </div>  
    )
}
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

    return(
        <div className="recipe-detail-main">
        {selectRecipes ? (
       <>
               <p className="recipe-view">조회수 : {selectRecipes.view}</p>
           <div className="recipe-header">
               <img src={`http://localhost:8080/uploads/${selectRecipes.foodImg}`} alt={selectRecipes.foodName} />
               <h2>{selectRecipes.name}</h2>
               <h1>{selectRecipes.foodName}<span>({selectRecipes.foodTime}분)</span></h1>
               <h3>{selectRecipes.categoryName}</h3>
               <br/>
               <div className="ingredient-table">
                   <h2>재료</h2><br/>
                   {selectRecipes.ingredientss && selectRecipes.ingredientss.length > 0 ? (
                   <table>
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
                                       <td>{ingredient.name}</td>
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
                           stepText && (
                               <div className="recipe-step" key={step}>
                                   <p>{`${index + 1}. ${stepText}`}</p>
                                   {stepImg && (
                                   <img  src={`http://localhost:8080/uploads/${stepImg}`} 
                                   alt={`Step ${step} image for ${selectRecipes.foodName}`} />  )}
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
       <hr/>
       <br/>
       <div className="review">
           <div className="review-head">
           <h2>요리 후기</h2>
           {review.length > 0 ? (
                   <ul>
                       {review.map((r) => (
                           <li key={r.reviewId}>
                               {r.name} - {r.reviewText} - {r.rating}점
                               <br />
                               <small>{new Date(r.createdAt).toLocaleString()}</small>
                               {r.email === localStorage.getItem("email") && (
                                   <div className="review-edit">
                                       <button onClick={() => handleEditButtonClick(r.reviewId, r.reviewText, r.rating)}>수정</button>
                                       <button onClick={() => handleDeleteReview(r.reviewId)}>삭제</button>
                                   </div>
                               )}
                           </li>
                       ))}
                   </ul>
               ) : (
                   <p>리뷰가 없습니다.</p>
               )}
           </div>

           {/* 리뷰 작성 폼 */}
           {token && !editReviewId ? (
               <form onSubmit={handleReviewSubmit}>
                   <div className="review-content">
                       <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                       <button type="submit">작성</button>
                   </div>
                   <div className="review-rating">
                       <label>별점: </label>
                       <div className="star-rating">
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
                       </div>
                   </div>
               </form>
           ) : (
               !token &&<p>로그인 후 리뷰를 작성할 수 있습니다.</p>
           )}

           {/* 리뷰 수정 폼 */}
           {editReviewId && (
               <form onSubmit={() => handleEditReviewSubmit(editReviewId)}>
                   <div className="review-content">
                       <textarea 
                           value={editContent} 
                           onChange={(e) => setEditContent(e.target.value)} 
                           required 
                       />
                       <button type="submit">수정</button>
                       <button type="button" onClick={handleEditCancel}>취소</button>
                   </div>
                   <div className="review-rating">
                       <label>별점: </label>
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
   </div>   
)
}
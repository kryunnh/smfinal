import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import './ListDetail.css'


export default function ListDetail(){
    const {id} = useParams();
    const [selectRecipes, setSelectRecipes] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]); 
    const [review, setReview] = useState([]);
    const [content, setContent] = useState(""); // 리뷰 내용
    const [rating, setRating] = useState(0); // 별점 기본값 5점
    const [token, setToken] = useState(localStorage.getItem('token')); 
    
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

    
     const handlePurchase = (ingredientName) =>{
         const searchUrl = `https://www.coupang.com/np/search?q=${encodeURIComponent(ingredientName)}`;
         window.open(searchUrl, '_blank');
     }
    useEffect(()=>{
        axios.get(`http://localhost:8080/api/review/${id}`)
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
    
        axios.post(`http://localhost:8080/api/review`, newReview, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
        .then(response => {
            console.log(response.data);
            // 리뷰 작성 후 리뷰 목록 갱신
            axios.get(`http://localhost:8080/api/review/${id}`)
                .then(response => {
                    setReview(response.data); // 리뷰 목록 갱신
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

    const handleStarClick = (index) => {
        setRating(index + 1); 
    };




    return(
        <div className="recipe-detail-main">
             {selectRecipes ? (
            <>
                    <p className="recipe-view">조회수 : {selectRecipes.view}</p>
                <div className="recipe-header">
                    <img src={selectRecipes.foodImg} alt={selectRecipes.foodName} />
                    <h1>{selectRecipes.foodName}</h1>
                    <h3>{selectRecipes.categoryName}</h3>
                    <br/>
                    <div className="ingredient-table">
                        <h2>재료</h2><br/>
                        {selectRecipes.ingredients && selectRecipes.ingredients.length > 0 ? (
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
                                {selectRecipes.ingredients.map((ingredient, index) => (
                                    index % 2 === 0 ? (
                                        <tr key={index}>
                                            <td>{ingredient.name}</td>
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
                                        <p>{`${index + 1}. ${stepText}`}</p>
                                        <img src={stepImg} alt={`Step ${step} image for ${selectRecipes.foodName}`} />
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
                            </li>
                        ))}
                    </ul>
                    ) : (
                        <p>리뷰가 없습니다.</p>
                    )}
                </div>
                    {/* 리뷰 작성 폼 */}
                    {token ? (
                    <form onSubmit={handleReviewSubmit}>
                        <div className="review-content">
                            <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                            <button type="submit">후기입력</button>
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
                                        &#9733; {/* 별 문자 */}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </form>
                ) : (
                    <p>로그인 후 리뷰를 작성할 수 있습니다.</p>
                )}
            </div>
            <br/>
            <hr/>
            <br/>
                <h2>관련 레시피</h2>
            <div className="recommend-recipe-container">
                <div className="recommend-recipe">
                    {filteredRecipes.map((recipe) => (
                        <div key={recipe.recipesId} className="recommend-card">
                            <Link to={`/list/${recipe.recipesId}`} onClick={()=>handleClick(recipe.recipesId)}>
                                <img src={recipe.foodImg} alt={recipe.foodName}/>
                            </Link>  
                            <h3>{recipe.foodName}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>   
    )
}
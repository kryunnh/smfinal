import { useState } from 'react';
import axios from 'axios';

const RecipeForm = () => {
    const [recipeName, setRecipeName] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [categoryId, setCategoryId] = useState(1); // 기본값은 한식 (1)
    const [foodImg, setFoodImg] = useState(null);
    const [ingredients, setIngredients] = useState(['']); // 재료 리스트
    const [step1, setStep1] = useState('');
    const [step2, setStep2] = useState('');
    const [step3, setStep3] = useState('');
    const [step4, setStep4] = useState('');
    const [step5, setStep5] = useState('');
    const [step6, setStep6] = useState('');
    const [stepImg1, setStepImg1] = useState(null);
    const [stepImg2, setStepImg2] = useState(null);
    const [stepImg3, setStepImg3] = useState(null);
    const [stepImg4, setStepImg4] = useState(null);
    const [stepImg5, setStepImg5] = useState(null);
    const [stepImg6, setStepImg6] = useState(null);

    // 재료 변경 핸들러
    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    // 재료 추가 핸들러
    const addIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    // 재료 삭제 핸들러
    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    
    // 폼 제출 핸들러
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('foodName', recipeName);
        formData.append('foodTime', cookingTime);
        formData.append('categoryId', categoryId);
        formData.append('foodImg', foodImg);  // 파일 추가
        ingredients.forEach((ingredient) => {
            formData.append('ingredients', ingredient);  // key는 'ingredients'로 설정
        });
    
        formData.append('step1', step1);
        formData.append('step2', step2);
        formData.append('step3', step3);
        formData.append('step4', step4);
        formData.append('step5', step5);
        formData.append('step6', step6);
        formData.append('stepImg1', stepImg1);  // 파일 추가
        formData.append('stepImg2', stepImg2);  // 파일 추가
        formData.append('stepImg3', stepImg3);  // 파일 추가
        formData.append('stepImg4', stepImg4);  // 파일 추가
        formData.append('stepImg5', stepImg5);  // 파일 추가
        formData.append('stepImg6', stepImg6);  // 파일 추가
        const token = localStorage.getItem('token'); // JWT 토큰 가져오기
        
        try {
            const response = await axios.post("http://localhost:8080/api/urecipe/adduserrecipe", formData, {
                headers: {
                    "Authorization": `Bearer ${token}`, // JWT 토큰 추가
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("레시피 등록 성공:", response.data);
        } catch (error) {
            console.error("서버 오류:", error);
            formData.forEach((value, key) => {
                console.log(key, value);
              });
        }
    };

    return (
        <div className="recipe-form">
            <h2>레시피 등록</h2>
            <div className="input-field">
                <label>레시피 이름</label>
                <input
                    type="text"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    required
                />
            </div>
            <div className="input-field">
                <label>조리 시간</label>
                <input
                    type="text"
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    required
                />
            </div>
            <div className="input-field">
                <label>카테고리</label>
                <div>
                    <input
                        type="radio"
                        name="category"
                        value="1"
                        checked={categoryId === 1}
                        onChange={() => setCategoryId(1)}
                    />
                    <label>한식</label>
                </div>
                <div>
                    <input
                        type="radio"
                        name="category"
                        value="2"
                        checked={categoryId === 2}
                        onChange={() => setCategoryId(2)}
                    />
                    <label>일식</label>
                </div>
                <div>
                    <input
                        type="radio"
                        name="category"
                        value="3"
                        checked={categoryId === 3}
                        onChange={() => setCategoryId(3)}
                    />
                    <label>중식</label>
                </div>
                <div>
                    <input
                        type="radio"
                        name="category"
                        value="4"
                        checked={categoryId === 4}
                        onChange={() => setCategoryId(4)}
                    />
                    <label>양식</label>
                </div>
            </div>
            <div className="input-field">
                <label>레시피 이미지</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFoodImg(e.target.files[0])}
                    required
                />
            </div>
            <div className="input-field">
                <label>재료</label>
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-input">
                        <input
                            type="text"
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                            placeholder={`재료 ${index + 1}`}
                            required
                        />
                        <button type="button" onClick={() => removeIngredient(index)}>삭제</button>
                    </div>
                ))}
                <button type="button" onClick={addIngredient}>재료 추가</button>
            </div>
            <div className="input-field">
                <label>조리 과정</label>
                <input
                    type="text"
                    value={step1}
                    onChange={(e) => setStep1(e.target.value)}
                    placeholder="1단계"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setStepImg1(e.target.files[0])}
                    required
                />
                <input
                    type="text"
                    value={step2}
                    onChange={(e) => setStep2(e.target.value)}
                    placeholder="2단계"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setStepImg2(e.target.files[0])}
                    required
                />
                <input
                    type="text"
                    value={step3}
                    onChange={(e) => setStep3(e.target.value)}
                    placeholder="3단계"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setStepImg3(e.target.files[0])}
                    required
                />
                <input
                    type="text"
                    value={step4}
                    onChange={(e) => setStep4(e.target.value)}
                    placeholder="4단계"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setStepImg4(e.target.files[0])}
                    required
                />
                <input
                    type="text"
                    value={step5}
                    onChange={(e) => setStep5(e.target.value)}
                    placeholder="5단계"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setStepImg5(e.target.files[0])}
                    required
                />
                <input
                    type="text"
                    value={step6}
                    onChange={(e) => setStep6(e.target.value)}
                    placeholder="6단계"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setStepImg6(e.target.files[0])}
                    required
                />
            </div>
            <div className="input-field">
                <button type="button" onClick={handleSubmit}>
                    레시피 등록
                </button>
            </div>
        </div>
    );
};

export default RecipeForm;

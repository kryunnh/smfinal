package com.project.service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Random;
import org.springframework.stereotype.Service;

import com.project.mapper.TarotMapper;
import com.project.mapper.RecipeMapper;
import com.project.model.TarotCard;
import com.project.model.Recipe;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TarotService {

    private final TarotMapper tarotMapper;
    private final RecipeMapper recipeMapper;
    private final Random random = new Random();

    // 🔹 랜덤 타로 카드 4장 + 랜덤 레시피 이미지 가져오기
    public Map<String, Object> getRandomTarotAndRecipe() {
        List<TarotCard> tarotCards = tarotMapper.getAllTarotCards();
        List<Recipe> recipes = recipeMapper.getAllRecipes();

        // 랜덤 타로 카드 4장 선택
        Map<String, Object> result = new HashMap<>();
        result.put("tarotCards", tarotCards.subList(0, Math.min(4, tarotCards.size())));

        // 랜덤 레시피 이미지 가져오기
        if (!recipes.isEmpty()) {
            Recipe randomRecipe = recipes.get(random.nextInt(recipes.size()));
            result.put("randomRecipeImage", randomRecipe.getImageUrl());
            result.put("randomRecipeId", randomRecipe.getId());
        }

        return result;
    }
}

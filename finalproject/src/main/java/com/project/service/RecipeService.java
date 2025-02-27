package com.project.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.project.mapper.RecipeMapper;
import com.project.model.Recipe;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeMapper recipeMapper;

    // 🔹 레시피 전체 조회
    public List<Recipe> getAllRecipes() {
        return recipeMapper.getAllRecipes();
    }

    // 🔹 레시피 상세 조회
    public Recipe getRecipeById(Long id) {
        return recipeMapper.getRecipeById(id);
    }

    // 🔹 레시피 등록
    public void insertRecipe(Recipe recipe) {
        recipeMapper.insertRecipe(recipe);
    }

    // 🔹 레시피 수정
    public void updateRecipe(Recipe recipe) {
        recipeMapper.updateRecipe(recipe);
    }

    // 🔹 레시피 삭제
    public void deleteRecipe(Long id) {
        recipeMapper.deleteRecipe(id);
    }
}

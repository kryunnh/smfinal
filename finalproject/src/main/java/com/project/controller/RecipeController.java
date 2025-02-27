package com.project.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.model.Recipe;
import com.project.service.RecipeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/recipe")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    // 🔹 레시피 - 전체 조회
    @GetMapping("/all")
    public List<Recipe> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    // 🔹 레시피 - 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipeById(id));
    }

    // 🔹 유저 - 레시피 등록
    @PostMapping("/add")
    public ResponseEntity<String> addRecipe(@RequestBody Recipe recipe) {
        recipeService.insertRecipe(recipe);
        return ResponseEntity.ok("Recipe added successfully");
    }

    // 🔹 유저 - 레시피 수정
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateRecipe(@PathVariable Long id, @RequestBody Recipe recipe) {
        recipe.setId(id);
        recipeService.updateRecipe(recipe);
        return ResponseEntity.ok("Recipe updated successfully");
    }

    // 🔹 유저 - 레시피 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.ok("Recipe deleted successfully");
    }
}

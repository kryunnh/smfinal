package com.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.model.UserRecipe;

@Service
public interface krhUserRecipeService {
	void addUserRecipe(UserRecipe userRecipe, List<String> ingredients);
}
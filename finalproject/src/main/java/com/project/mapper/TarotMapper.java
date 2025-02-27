package com.project.mapper;

import com.project.model.TarotCard;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TarotMapper {

    // 🔹 모든 타로 카드 조회
    @Select("SELECT * FROM tarot_cards")
    List<TarotCard> getAllTarotCards();
}

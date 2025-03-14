import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserActivity({ userEmail, userId }) {
  const [boards, setBoards] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    axios.get(`/user/my-board-titles?email=${userEmail}`)
      .then(res => setBoards(res.data))
      .catch(console.error);

    axios.get(`/user/${userId}/favorites`)
      .then(res => setFavorites(res.data))
      .catch(console.error);
  }, [userEmail, userId]);

  const removeFavorite = (recipeId) => {
    axios.delete(`/user/${userId}/favorites/${recipeId}`)
      .then(() => alert('즐겨찾기 삭제 완료'))
      .catch(console.error);
  };

  return (
    <div>
      <h3>내가 쓴 게시글</h3>
      <ul>
        {boards.map(board => (
          <li key={board.id}>{board.title}</li>
        ))}
      </ul>

      <h3>즐겨찾기</h3>
      <ul>
        {favorites.map(fav => (
          <li key={fav.id}>
            {fav.title}
            <button onClick={() => removeFavorite(fav.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

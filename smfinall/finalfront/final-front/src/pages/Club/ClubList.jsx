import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ClubList.css';

const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [itemsPerPage] = useState(6); // 페이지당 아이템 수
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태
  
  useEffect(() => {
    const fetchClubsAndTags = async () => {
      try {
        // 동호회 목록과 태그 목록을 동시에 가져오기
        const clubResponse = await axios.get('http://localhost:8080/api/club');
        const tagResponse = await axios.get('http://localhost:8080/api/club/tags');
        setClubs(clubResponse.data);
        setTags(tagResponse.data);
        setFilteredClubs(clubResponse.data.slice(0, itemsPerPage)); // 첫 6개만 기본으로 표시
        setLoading(false);
      } catch (err) {
        setError('동호회 목록을 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };
  
    fetchClubsAndTags();

    const token = localStorage.getItem('token'); // JWT 토큰이 localStorage에 저장되어 있다고 가정
    if (token) {
      setIsLoggedIn(true); // 토큰이 있으면 로그인된 상태로 설정
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm === '') {
      setFilteredClubs(clubs.slice(0, itemsPerPage)); // 검색 초기화 시 처음 6개만 표시
    } else {
      const filtered = clubs.filter((club) =>
        club.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.clubFeatures.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClubs(filtered.slice(0, itemsPerPage)); // 검색 후 첫 6개만 표시
    }
    setCurrentPage(1);
  };

  const handleTagClick = async (tagId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/club/tags/${tagId}`);
      setFilteredClubs(response.data.slice(0, itemsPerPage)); // 태그 필터링 후 첫 6개만 표시
      setCurrentPage(1);
      if (selectedTagId === tagId) {
        setSelectedTagId(null);
        setFilteredClubs(clubs.slice(0, itemsPerPage)); // 태그 선택 취소 시 초기 6개로 리셋
      } else {
        setSelectedTagId(tagId);
      }
    } catch (error) {
      setError('태그에 맞는 동호회를 불러오는 데 실패했습니다.');
      console.error(error);
    }
  };

  // "더보기" 클릭 시 기존 리스트에 6개 추가
  const handleLoadMore = async () => {
    setCurrentPage(currentPage + 1);
    let nextClubs = [];
  
    if (selectedTagId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/club/tags/${selectedTagId}`);
        nextClubs = response.data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
      } catch (error) {
        setError('태그에 맞는 동호회를 불러오는 데 실패했습니다.');
        console.error(error);
        return;
      }
    } else {
      nextClubs = clubs.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    }
  
    setFilteredClubs((prevClubs) => [...prevClubs, ...nextClubs]);
  };
  
  // 더보기 버튼이 필요한지 체크
  const hasMoreClubs = selectedTagId 
    ? filteredClubs.length < tags.find(tag => tag.tagId === selectedTagId)?.clubCount
    : filteredClubs.length < clubs.length;
  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="club-page">
      <h1 className="big-title">다함께 요리하자</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search"
        />
        <button onClick={handleSearchClick} className="search-btn">검색</button>
      </div>
      
      <h2 style={{ color: "#FF8746" }}>🔥 신규 태그 🔥</h2>
      <div className="tag-list">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <button
              key={tag.tagId}
              onClick={() => handleTagClick(tag.tagId)}
              className="tag-btn"
              style={{
                backgroundColor: selectedTagId === tag.tagId ? '#FFA575' : '', // 선택된 태그에 배경색 적용
              }}
            >
              {selectedTagId === tag.tagId ? '☑️ ' : '🟧'} {tag.tagName}
            </button>
          ))
        ) : (
          <p>태그 목록을 불러오는 데 실패했습니다.</p>
        )}
      </div>

      <ul>
        {filteredClubs.length === 0 ? (
          <li>검색 결과가 없습니다.</li>
        ) : (
          filteredClubs.map((club, index) => (
            <li key={`${club.clubId}-${index}`}>
              <img
              style={{ width: "100%", height:"200px" }}
              src={`http://localhost:8080/uploads/clubimage/${club.clubImage}`}
              alt={`${club.clubName} 이미지`}
              className="club-image"
            />
              <h2>{club.clubName}</h2>
              <p>{club.location}</p>
              <p>마감일: {club.date}</p>
              <Link to={`/club/${club.clubId}`} className="detail-link">상세보기</Link>
            </li>
          ))
        )}
      </ul>
      <div className="more-club">
        {hasMoreClubs && (
          <button onClick={handleLoadMore} className="load-more-btn">
            더보기
          </button>
        )}
      </div>
      <div className="add-club">
       {/* 모임 추가 버튼: 로그인된 사용자만 보이도록 조건 추가 */}
       {isLoggedIn && (
          <Link to="/clubwrite" className="add-club-btn">
            모임 생성
          </Link>
        )}
      </div>
    </div>
  );
};

export default ClubList;
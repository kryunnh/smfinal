import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BoardList.css';

const BoardList = () => {
  const [boardList, setBoardList] = useState([]);  // 게시글 목록
  const [page, setPage] = useState(1);   // 현재 페이지
  const [size, setSize] = useState(10);   // 한 페이지당 개수
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [findStr, setFindStr] = useState(''); // 검색어

  // 게시글 목록 가져오기
  const fetchBoardList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/board', {
        params: {
          page: page,
          size: size,
          findStr: findStr,
        },
      });

      // 응답 데이터 확인
      if (response.data && response.data.boardList && response.data.pageVO) {
        setBoardList(response.data.boardList); 
        setTotalPages(response.data.pageVO.totalPages || 1);  // totalPages가 없으면 기본값 1로 설정
      } else {
        console.error('응답 데이터 구조가 예상과 다릅니다.', response.data);
      }
    } catch (error) {
      console.error('게시글 목록 가져오기 실패:', error);
    }
  };

  // 처음에는 그냥 페이지 변경에만 반응하고, 검색어가 바뀌어도 fetchBoardList는 실행되지 않도록.
  useEffect(() => {
    fetchBoardList();
  }, [page, size]);  // 페이지나 페이지 크기만 변경될 때마다 실행

  // 검색어 변경
  const handleSearchChange = (event) => {
    setFindStr(event.target.value);  // 검색어 업데이트
  };

  // 검색 버튼 클릭 시
  const handleSearchClick = () => {
    setPage(1);  // 검색 시 첫 페이지로 이동
    fetchBoardList();  // 검색어에 맞는 게시글 리스트 다시 불러오기
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // 페이지네이션
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button 
          key={i}
          className={i === page ? "active" : ""} // active 클래스 조건부 적용
          onClick={() => handlePageChange(i)}
          disabled={i === page}
          style={{ margin: '0 5px' }}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="page">
      <h1 className="big-title">요리 고민방</h1>
      
      {/* 검색 input과 버튼 */}
      <div className="search-container">
        <input
          type="text"
          value={findStr}
          onChange={handleSearchChange}  // 검색어 입력 처리
          placeholder="검색어를 입력하세요"
          className="search"
        />
        <button onClick={handleSearchClick} className="search-btn">검색</button>
      </div>
      
      {/* 게시글 목록 */}
      <table>
        <thead className="thz">
        </thead>
        <tbody className="tdz">
          {boardList.map((board) => (
            <tr key={board.boardId} >
              <td>{board.boardId}</td>
              <td> 
                <Link to={`/boardlist/${board.boardId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  {board.title}
                </Link>
              </td>
              <td>{board.createdAt}</td>
              <td>{board.views}</td>
              <td>{board.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* 글쓰기 버튼 추가 */}
      <div className="write-button-container">
        <Link to="/boardwrite">
          <button className="write-btn">글쓰기</button>
        </Link>
      </div>
      
      {/* 페이징 */}
      <div className="board-paging">
        {renderPagination()}
      </div>
    </div>
  );
};

export default BoardList;

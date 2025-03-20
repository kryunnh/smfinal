import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ClubWrite.css';

const ClubWrite = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [tag, setTag] = useState(''); // 해시태그
  const [date, setDate] = useState(null);
  const [clubUrl, setClubUrl] = useState('');
  const [clubImage, setClubImage] = useState(null);  // 대표 이미지 상태

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // 이미지 파일 선택 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setClubImage(file);
    } else {
      alert("이미지 파일만 업로드할 수 있습니다.");
    }
  };

  // clubUrl 변경 처리
  const handleClubUrlChange = (e) => {
    setClubUrl(e.target.value);
  };

  // 해시태그 처리
  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const handleSubmit = async () => {
    const clubFeatures = editor.getHTML();

    // 유효성 검사
    if (!title.trim() || !clubFeatures.trim() || !location.trim() || !tag.trim() || !date || !clubUrl) {
      alert('모든 필드를 입력하세요.');
      return;
    }
    
    // 해시태그를 쉼표로 구분된 문자열로 변환하고, 배열로 변환
    const hashtags = tag.split(',').map(item => item.trim());

    // 해시태그 값에서 특수 문자 제거 (예시: 작은따옴표 이스케이프 처리)
    const cleanHashtags = hashtags.map(hashtag => hashtag.replace(/'/g, "\\'"));


    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');  // 월을 2자리로
      const day = String(date.getDate()).padStart(2, '0');  // 일을 2자리로
      return `${year}-${month}-${day}`;  // yyyy-MM-dd 형식
  };
  
    // endDate가 Date 객체로 넘어왔다고 가정
    const formattedEndDate = formatDate(new Date(date));  // '2025-03-21' 형태로 변환


    // FormData로 이미지와 다른 데이터 전송
    const formData = new FormData();
    formData.append('title', title);
    formData.append('location', location);
    formData.append('hashtags', JSON.stringify(cleanHashtags)); // 해시태그 배열을 JSON 문자열로 전송
    formData.append('date', formattedEndDate);
    formData.append('clubFeatures', clubFeatures);
    formData.append('clubUrl', clubUrl);
    if (clubImage) {
      formData.append('clubImage', clubImage);  // 이미지 파일 추가
    }
    formData.forEach((value, key) => {
      console.log(key + ": " + value);
  });
    try {
      const response = await axios.post(
        'http://localhost:8080/api/club/add',
        formData, // FormData 객체 전송
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // multipart/form-data 형식으로 전송
          },
        }
      );
      alert('게시글이 등록되었습니다!');
      navigate('/clublist');
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      console.log(formData);
      alert('게시글 등록 중 오류가 발생했습니다.');
    }
  };

  if (!editor) return null;

  return (
    <div className="editor-container">
      <h1 className="big-title">모임 생성하기</h1>
      {/* 기타 입력 필드들 */}
      <div className="mozip">모임 명</div>
      <input
        type="text"
        className="input-field"
        placeholder="모임 이름"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="mozip">모임 지역</div>
      <input
        type="text"
        className="input-field"
        placeholder="모임 지역"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <div className="mozip">모집 마감일</div>
      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        dateFormat="yyyy-MM-dd"
        className="input-field input-date"
      />
      <div className="mozip">모임 해시태그</div>
      <input
        type="text"
        className="input-field"
        placeholder="모임 해시태그 (쉼표로 구분)"
        value={tag}
        onChange={handleTagChange}
      />
      <div className="mozip">모임 URL</div>
      <input
        type="text"
        className="input-field"
        placeholder="모임 URL"
        value={clubUrl}
        onChange={handleClubUrlChange}
      />

      <div className="mozip">모임 설명</div>
      <EditorContent editor={editor} className="clubwrite-content" />

      {/* 이미지 업로드 */}
      <div className="mozip">대표 이미지를 선택하세요</div>
      <input
        type="file"
        className="input-field"
        onChange={handleImageChange}
        accept="image/*"
      />

      {clubImage && (
        <div className="image-preview">
          <img src={URL.createObjectURL(clubImage)} alt="미리보기" className="preview-img" />
        </div>
      )}

      <div className="button-container">
        <button onClick={() => navigate('/clublist')} className="dol">
          돌아가기
        </button>
        <button className="save" onClick={handleSubmit}>
          모임 등록
        </button>
      </div>
    </div>
  );
};

export default ClubWrite;

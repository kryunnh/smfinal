import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BoardWrite.css';

const BoardWrite = () => {
  const [title, setTitle] = useState(''); // 제목 상태
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
        class: 'tiptap-editor', // 에디터에 클래스 지정
      },
    },
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // 토큰 가져오기

  // 이미지 업로드 처리
  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // 선택한 이미지 파일

    if (file) {
      const formData = new FormData();
      formData.append('file', file); // 파일 추가

      // 이미지 업로드 요청
      axios
        .post('http://localhost:8080/api/board/uploadImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // 인증 토큰
          },
        })
        .then((response) => {
          const imageUrl = response.data.imageUrl; // 서버에서 받은 이미지 URL
          // 에디터에 이미지 삽입
          editor.chain().focus().setImage({ src: imageUrl }).run();
        })
        .catch((error) => {
          console.error('이미지 업로드 실패:', error);
          alert('이미지 업로드 실패');
        });
    }
  };

  // 게시글 저장 요청
  const handleSubmit = async () => {
    const content = editor.getHTML(); // HTML로 변환된 내용 가져오기

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/board/add',
        {
          title,
          content,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // 헤더에 토큰 포함
        }
      );
      console.log('게시글 저장 성공:', response.data);
      alert('게시글이 등록되었습니다!');
      navigate('/boardlist');
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
    }
  };

  // 목록 버튼 클릭 시 boardlist 페이지로 이동
  const handleGoToBoardList = () => {
    navigate('/boardlist');
  };

  if (!editor) return null;

  return (
    <div className="editor-container">
      <h1 className="big-title">요리고민방 글쓰기</h1>

      {/* 제목 입력란 */}
      <input
        type="text"
        className="title-input"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 툴바 */}
      <div className="toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>

        <button className="image-upload-btn" onClick={() => document.getElementById('file-upload').click()}>
          🖼 이미지 추가
        </button>
        <input
          id="file-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
          accept="image/*"
        />
      </div>

      {/* 에디터 내용 */}
      <EditorContent editor={editor} className="boardwrite-content" />
    <div className="button-container">
      {/* 게시글 저장 버튼 */}
      <button onClick={handleGoToBoardList} className="board-goback">
        돌아가기
      </button>
      <button className="save-btn" onClick={handleSubmit}>게시글 등록</button>
    </div>
    </div>
  );
};

export default BoardWrite;

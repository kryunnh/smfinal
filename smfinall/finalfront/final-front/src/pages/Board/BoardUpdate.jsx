import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import axios from 'axios';
import './BoardUpdate.css';

const BoardUpdate = () => {
  const { boardId } = useParams();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [incremented, setIncremented] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let userEmail = null;

  if (token) {
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const decodedToken = JSON.parse(atob(base64));
      userEmail = decodedToken.sub;
    } catch (error) {
      console.error("토큰 디코딩 실패:", error);
    }
  }

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

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/board/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTitle(response.data.title);
        if (editor) {
          editor.commands.setContent(response.data.content);
        }
      })
      .catch((error) => {
        console.error('게시글 불러오기 실패:', error);
        alert('게시글을 불러오는 중 오류가 발생했습니다.');
      })
      .finally(() => setLoading(false));

    if (!incremented) {
      console.log("조회수 증가 API 호출!");
      axios
        .put(`http://localhost:8080/api/board/${boardId}/incrementViews`, null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((error) => {
          console.error('조회수 증가 실패:', error);
        });
      setIncremented(true);
    }

  }, [boardId, editor, incremented, token]);

  const handleUpdate = async () => {
    const content = editor.getHTML();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    try {
      const updatedBoard = {
        boardId: boardId,
        title,
        content,
        authorEmail: userEmail,
      };

      await axios.put(
        `http://localhost:8080/api/board/${boardId}/update`,
        updatedBoard,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('게시글이 수정되었습니다!');
      setTitle(title);
      editor.commands.setContent(content);

      navigate(`/boardlist/${boardId}`);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  if (!editor || loading) return <p>로딩 중...</p>;

  return (
    <div className="editor-container">
      <h1 className="big-title">게시글 수정</h1>
      <input
        type="text"
        className="title-input"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="toolbar">
      </div>
      <EditorContent editor={editor} className="boardwrite-content" />
      <button onClick={() => navigate(`/boardlist/${boardId}`)} className="board-goback">돌아가기</button>
      <button className="save-btn" onClick={handleUpdate}>게시글 수정</button>
    </div>
  );
};

export default BoardUpdate;

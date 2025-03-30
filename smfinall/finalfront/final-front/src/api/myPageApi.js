import api from "./api";

/**  
 * ===========================================
 * ✅ 마이페이지 관련 기능 (내 활동 포함)
 * ===========================================
 */
export const myPageApi = {
  // 🔹 내 정보 조회
  getMyInfo: (email) => api.get(`/user/get-user?email=${email}`),

  // 🔹 내 정보 수정
  updateMyInfo: (userData) => api.put("/user/update", userData),

  // 🔹 회원 탈퇴 요청
  requestAccountDeletion: (email, reason) =>
    api.post("/user/request-deletion", { email, reason }),

  // 🔹 내가 작성한 게시글 목록 조회
  getMyPosts: (email) => api.get(`/user/my-board-titles?email=${email}`),

  // 🔹 내 알림 목록 조회
  getMyNotifications: (email) => api.get(`/user/notifications?email=${email}`),

  // 🔹 특정 알림 읽음 처리
  readNotification: (notificationId, email) =>
    api.patch("/user/notifications/read", { notificationId, email }),
// ✅ 특정 알림 삭제 API 호출
deleteNotification: (notificationId) =>
    api.delete(`/user/notifications/${notificationId}`),
  // 🔹 내 즐겨찾기(관심목록) 조회
  getMyFavorites: (userId) => api.get(`/user/${userId}/favorites`),

  // 🔹 특정 즐겨찾기 삭제
  removeFavorite: (userId, recipeId) =>
    api.delete(`/user/${userId}/favorites/${recipeId}`),

  // 🔹 1:1 문의 작성
  createInquiry: (inquiryData) => api.post("/user/inquiries", inquiryData),

  // 🔹 1:1 문의 목록 조회
  getUserInquiries: (email) => api.get(`/user/inquiries/list?email=${email}`),

  // 🔹 특정 1:1 문의 삭제
  deleteInquiry: (id, email) =>
    api.delete(`/user/inquiries/delete`, { data: { id, email } }),
};
// ✅ `myPageApi` 내보내기
export default myPageApi;
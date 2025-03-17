import api from "./api";
/**  
 * ===========================================
 * ✅ 관리자 관련 기능 (회원, 공모전, 게시판, 통계)
 * ===========================================
 */
export const adminApi = {
    /** 🔹 전체 회원 조회 */
    getAllUsers: () => api.get("/admin/users"),
  
    /** 🔹 특정 회원 삭제 */
    deleteUser: (email) => api.delete(`/admin/users/${email}`),
  
    /** 🔹 회원 탈퇴 요청 목록 조회 */
    getDeletionRequests: () => api.get("/admin/deletion-requests"),
  
    /** 🔹 회원 탈퇴 승인 */
    approveDeletion: (email) => api.delete(`/admin/deletion-requests/${email}`),
  
    /** 🔹 전체 1:1 문의 조회 */
    getAllInquiries: () => api.get("/admin/inquiries"),
  
    /** 🔹 특정 문의 답변 */
    replyToInquiry: (id, reply) =>
      api.patch(`/admin/inquiries/reply/${id}?reply=${reply}`),
  
    /** 🔹 특정 문의 삭제 */
    deleteInquiry: (id) => api.delete(`/admin/inquiries/${id}`),
  
    /** 🔹 회원에게 알림 전송 */
    sendNotification: (receiverEmail, message) =>
      api.post("/admin/send-notification", { receiverEmail, message }),
  
    /** 🔹 관리자 알림 목록 조회 */
    getAdminNotifications: (email) =>
      api.get(`/admin/notifications?email=${email}`),
  
    /** 🔹 특정 알림 읽음 처리 */
    readAdminNotification: (id) =>
      api.patch(`/admin/notifications/read/${id}`),
  
    /** 🔹 특정 알림 삭제 */
    deleteAdminNotification: (id) => api.delete(`/admin/notifications/${id}`),
  
    /** 🔹 게시판 관리 - 전체 게시글 조회 */
    getAllPosts: () => api.get("/admin/boards"),
  
    /** 🔹 특정 게시글 삭제 */
    deletePost: (postId) => api.delete(`/admin/boards/${postId}`),
  
    /** 🔹 공모전 레시피 목록 조회 */
    getCompetitionRecipes: () => api.get("/admin/competitions"),
  
    /** 🔹 특정 공모전 레시피 삭제 */
    deleteCompetitionRecipe: (recipeId) =>
      api.delete(`/admin/competitions/${recipeId}`),
  
    /** 🔹 통계 데이터 조회 (구글 차트 연동) */
    getStatistics: () => api.get("/admin/statistics"),
  
    // ✅ 추가된 기능
  
    /** 🔹 일반 레시피 목록 조회 */
    getAllRecipes: () => api.get("/admin/recipes"),
  
    /** 🔹 특정 레시피 상세 조회 */
    getRecipeById: (recipeId) => api.get(`/admin/recipes/${recipeId}`),
  
    /** 🔹 레시피 추가 */
    addRecipe: (recipeData) => api.post("/admin/api/admin/recipes", recipeData),
  
    /** 🔹 레시피 수정 */
    updateRecipe: (recipeId, updatedData) =>
      api.put(`/admin/recipes/${recipeId}`, updatedData),
  
    /** 🔹 레시피 삭제 */
    deleteRecipe: (recipeId) => api.delete(`/admin/recipes/${recipeId}`),
  
    /** 🔹 승인 대기 중인 유저 레시피 조회 */
    getPendingUserRecipes: () => api.get("/admin/user-recipes/pending"),
  
    /** 🔹 특정 유저 레시피 상세 조회 */
    getUserRecipeById: (recipeId) => api.get(`/admin/user-recipes/${recipeId}`),
  
    /** 🔹 유저 레시피 승인 */
    approveUserRecipe: (recipeId) =>
      api.patch(`/admin/user-recipes/${recipeId}/approve`),
  
    /** 🔹 유저 레시피 삭제 */
    deleteUserRecipe: (recipeId) =>
      api.delete(`/admin/user-recipes/${recipeId}`),
  
    /** 🔹 일별 회원가입 수 통계 */
    getDailySignups: () => api.get("/admin/daily-signups"),
  
    /** 🔹 조회수가 많은 인기 레시피 조회 */
    getTopViewedRecipes: () => api.get("/admin/top-viewed-recipes"),
  
    /** 🔹 최근 30일 동안 가장 많이 로그인한 유저 */
    getMostActiveUsers: () => api.get("/admin/most-active-users"),
  
    /** 🔹 현재 접속자 수 조회 */
    getCurrentActiveUsers: () => api.get("/admin/current-users"),
  };
  // ✅ `myPageApi` 내보내기
export default adminApi;
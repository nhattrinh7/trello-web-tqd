export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/**
 * Cách xử lí bug logic thư viện Dnd-kit khi Column rỗng:
 * Phía FE sẽ tự tạo ra một card đặc biệt: PlaceholderCard không liên quan tới Backend
 * Card đặc biệt này được ẩn ở giao diện UI người dùng
 * Cấu trúc Id của card này để Unique rất đơn giản, không cần làm random phức tạp:
 * "columnId-placeholder-card" (mỗi Column chỉ có thể có tối đa 1 PlaceholderCard)
 * Quan trọng khi tạo: phải đầy đủ: (_id, boardId, columnId, FE_PlaceholderCard)
 *** Kỹ hơn nữa về cách tạo chuẩn ở bước nào thì sẽ học ở phần tích hợp API-backend vào dự án vì đây là file mock data
*/
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

// Kỹ thuật dùng css pointer-event để chặn user spam click tại bất kỳ chỗ nào có hành động click gọi api
// Đây là một kỹ thuật rất hay tận dụng Axios Interceptors và CSS Pointer-events để chỉ phải viết code xử lý một lần cho toàn bộ dự án
// Cách sử dụng: Với tất cả các link hoặc button mà có hành động gọi api thì thêm class "interceptor-loading" cho nó là xong.
export const interceptorLoadingElements = (calling) => {
  // DOM lấy ra toàn bộ phần tử trên page hiện tại có className là 'interceptor-loading'
  const elements = document.querySelectorAll('.interceptor-loading') // trả về 1 NodeList các phần tử có class là '.interceptor-loading'
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Nếu đang trong thời gian chờ gọi API (calling === true) thì sẽ làm mờ phần tử và chặn click bằng css pointer-events
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none' // không nhận bất kì sự kiện chuột nào, ko có sự kiện hover, ko gì cả
    } else {
      // Ngược lại thì trả về như ban đầu, không làm gì cả
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}


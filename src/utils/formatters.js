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
export const generatePlaceholderCard = column => {
  return {
    _id: `${column._id}-placeholder-card`, 
    boardId: column.boardId, 
    columnId: column._id,
    FE_PlaceholderCard: 'true'
  }
}

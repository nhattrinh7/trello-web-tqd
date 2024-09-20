import Box from "@mui/material/Box"
import ListColumns from "./ListColumns/ListColumns"
import { mapOrder } from "~/utils/sorts"
import { DndContext,
         PointerSensor,
         MouseSensor,
         TouchSensor,
         useSensor,
         useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from "react"

function BoardContent({ board }) {

  const pointerSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(PointerSensor, {activationConstraint: { delay: 10, tolerance: 5 } })
  // const sensors = useSensors(pointerSensor, mouseSensor, touchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)
 // sử dụng kết hợp sensors là mouse và touch để có trải nghiệm tốt nhất trên mobile

  const [orderedColumns, setOrderedColumns] = useState([])
  
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
 
  const handleDragEnd = (event) => {
    console.log('handleDragEnd: ', event)
    const { active, over } = event

    // kéo linh tinh ra ngoài thì over=null, thì làm này cho đỡ bị lỗi
    if(!over) return 

    if(active.id !== over.id) {
        // lấy vị trí cũ từ thằng active
        const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
        // lấy vị trí mới từ thằng over
        const newIndex = orderedColumns.findIndex(c => c._id === over.id)

        // dndOrderedColumns: mảng sau khi đã kéo thả
        // arrayMove dùng để sắp xếp lại mảng Columns ban đầu thành mảng sau khi kéo thả, 
        //nếu ko kéo xong trình duyệt nó ko hiển thị thứ tự mới
        const dndOrderedColumns = arrayMove(orderedColumns,oldIndex, newIndex)
        // cập nhật mảng column xong thì lấy thứ tự id của chúng nó, sau còn cập nhật thứ tự column vào DB, 
        // nếu ko là ko lưu dc thứ tụ column, f5 cái là mất 
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

        // cập nhât lại sau khi đã kéo thả
        setOrderedColumns(dndOrderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
      </Box>
    </DndContext>
    
  );
}

export default BoardContent;
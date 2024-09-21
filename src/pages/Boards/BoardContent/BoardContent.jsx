import Box from "@mui/material/Box"
import ListColumns from "./ListColumns/ListColumns"
import { mapOrder } from "~/utils/sorts"
import { DndContext,
         PointerSensor,
         MouseSensor,
         TouchSensor,
         useSensor,
         useSensors,
         DragOverlay,
         defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from "react"
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, {activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, {activationConstraint: { delay: 10, tolerance: 5 } })
  const sensors = useSensors(mouseSensor, touchSensor)
 // sử dụng kết hợp sensors là mouse và touch để có trải nghiệm tốt nhất trên mobile

  const [orderedColumns, setOrderedColumns] = useState([])

  // cùng một thời điểm chỉ có 1 phần tử được kéo (column hoặc card), đống này đại diện cho phần tử mình kéo
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }
  
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

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  console.log('activeDragItemId: ', activeDragItemId)
  console.log('activeDragItemType: ', activeDragItemType)
  console.log('activeDragItemData: ', activeDragItemData)

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }
  

  return (
    <DndContext 
      onDragEnd={handleDragEnd} 
      onDragStart={handleDragStart} 
      sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
    
  );
}

export default BoardContent;
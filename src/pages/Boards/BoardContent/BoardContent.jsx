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
         defaultDropAnimationSideEffects,
         closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from "react"
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  const mouseSensor = useSensor(MouseSensor, {activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, {activationConstraint: { delay: 250, tolerance: 10 } })
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

  // tìm Column chứa Card có id là cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  // kích hoạt trong quá trình kéo một phần tử
  const handleDragOver = (event) => {
    console.log('handleDragOver: ', event)
    // không làm gì thêm nếu đang kéo Column, vì Column đang kéo thả ok rồi
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // còn nếu kéo Card thì xủ lí thêm để kéo Card giữa các Column
    const { active, over } = event

    if(!active || !over) return
    
    // activeDraggingCard là card đang được kéo, overCard là card đích
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    
    if(!overColumn) return

    // kéo card từ column này sang column khác mới tính
    if(activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        // tìm index của overCard trong column đích - nơi activeCard được kéo đến
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        // tính toán index mới khi kéo sang
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        const nextColumns = cloneDeep(prevColumns)

        // clone activeColumn và overColumn ra mảng mới, thao tác với mảng mới để tránh đụng đến mảng ban đầu
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        if(nextActiveColumn) {
          // xóa cái card bị kéo đi mất ở activeColumn 
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // xóa card xong cập nhật mảng cardOrderIds 
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        if(nextOverColumn) {
          // kiểm tra xem card đang kéo có tồn tại ở overColumn chưa, có tồn tại rồi thì phải xóa đi trước đã
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // thêm card đang kéo vào overColumn theo vị trí index mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          // thêm xong thì cập nhật mảng cardOrderIds
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        return nextColumns

      })
    }

  }
  
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    // Nếu đang kéo Card thì không làm gì thêm, ko đụng vào code kéo thả Column phía dưới 
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) return

    const { active, over } = event
    // kéo linh tinh ra ngoài thì over=null, thì làm này cho đỡ bị lỗi
    if(!active || !over) return 

    if(active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
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


  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }
  
  return (
    <DndContext 
      onDragStart={handleDragStart} 
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd} 
      sensors={sensors}
      collisionDetection={closestCorners}
    >
      collisionDetection={}
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
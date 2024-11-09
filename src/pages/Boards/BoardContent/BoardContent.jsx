import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState, useCallback, useRef } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({
  board,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn,
  deleteColumnDetails
}) {
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 10 } })
  const sensors = useSensors(mouseSensor, touchSensor)
  // sử dụng kết hợp sensors là mouse và touch để có trải nghiệm tốt nhất trên mobile

  const [orderedColumns, setOrderedColumns] = useState([])

  // cùng một thời điểm chỉ có 1 phần tử được kéo (column hoặc card), đống này đại diện cho phần tử mình kéo
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // Điểm va chạm cuối cùng (trong xử lí thuật toán va chạm)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(board.columns)
  }, [board])

  // tìm Column chứa Card có id là cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  // khởi tạo function chung xử lí setOrderedColumns cho DragOver và DragEnd
  const moveCardBetweenDifferentColumn = (
    overColumn,
    activeColumn,
    overCardId,
    active,
    over,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns(prevColumns => {

      // tìm index của overCard trong column đích - nơi activeCard được kéo đến
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // tính toán index mới của activeCard khi kéo sang
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height // dùng bottom là lỗi
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      const nextColumns = cloneDeep(prevColumns)

      // clone activeColumn và overColumn ra mảng mới, thao tác với mảng mới để tránh đụng đến mảng ban đầu
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)


      if (nextActiveColumn) {
        // xóa cái card bị kéo đi mất ở activeColumn
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //Thêm Placeholder Card nếu Column rỗng: bị kéo hết Card đi không còn cái nào
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // xóa card xong cập nhật mảng cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }


      if (nextOverColumn) {
        // kiểm tra xem card đang kéo có tồn tại ở overColumn chưa, có tồn tại rồi thì phải xóa đi trước đã
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // trong DragEnd, sau khi kéo card giữa 2 column khác nhau phải cập nhật lại columnId của card
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // thêm card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        //xóa PlacehoderCard 37.2
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        // thêm xong thì cập nhật mảng cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      // chỉ gọi API khi chạy handleDragEnd, phải dùng oldColumnWhenDraggingCard
      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(activeDraggingCardId, oldColumnWhenDraggingCard._id, nextOverColumn._id, nextColumns)
      }

      return nextColumns
    })
  }
  // phần tử được mình kéo: active, phần tử mà mình kéo đến: over
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // console.log('handleDragStart: ', event)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // kích hoạt trong quá trình kéo một phần tử
  const handleDragOver = (event) => {

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event


    if (!active || !over) return

    // activeDraggingCard là card đang được kéo, overCard là card đích
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    // kéo card từ column này sang column khác mới tính
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumn(
        overColumn,
        activeColumn,
        overCardId,
        active,
        over,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    // kéo linh tinh ra ngoài thì over=null, thì làm này cho đỡ bị lỗi
    if (!active || !over) return


    // xử lí kéo thả khi kéo thả Card -----
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {

      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!overColumn) return

      // dùng activeDragItemData.columnId ở đây cũng được, vì activeDragItemData và oldColumnWhenDraggingCard được set trong handleDragStart
      // nên chứa dữ liệu ban đầu. Chứ dùng activeColumn._id ở đây ko dc vì có setOrderedColumns ở handleDragOver nó set state
      // mất rồi, dữ liệu ko còn như ban đầu nữa
      // nhưng về sau dùng activeDragItemData.columnId sẽ gặp lỗi, nên tốt nhất là dùng oldColumnWhenDraggingCard (35 FE)
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {

        // xử lí khi kéo thả card giữa 2 column với nhau
        moveCardBetweenDifferentColumn(
          overColumn,
          activeColumn,
          overCardId,
          active,
          over,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {

        // xử lí kéo thả card trong cùng 1 column
        const oldCardIndex = oldColumnWhenDraggingCard?.cards.findIndex(c => c._id === activeDragItemId) //lấy active.id cũm được nhé
        const newCardIndex = overColumn?.cards.findIndex(c => c._id === overCardId)

        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(card => card._id)

        // vẫn gọi update state để tránh delay giao diện khi kéo thả (small trick)
        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)

          // trong 1 list các column, tìm tới column chúng ta đang thả
          let targetColumn = nextColumns.find(column => column._id === overColumn._id)

          //cập nhật thứ tự các card cho column đang thả đó, và cập nhật luôn cả cardOrderIds
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds

          return nextColumns
        })

        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)

      }
    }


    // xử lí kéo thả khi kéo thả Column -----
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        // dndOrderedColumns: mảng sau khi đã kéo thả
        // arrayMove dùng để sắp xếp lại mảng Columns ban đầu thành mảng sau khi kéo thả,
        // nếu ko kéo xong trình duyệt nó ko hiển thị thứ tự mới
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        // cập nhât lại sau khi đã kéo thả, kéo thả xong thì render lại UI luôn cho người dùng cảm thấy mượt, API đang gọi chưa xong cũng sẽ ko sao (small trick)
        setOrderedColumns(dndOrderedColumns)

        /**
         * kéo thả xong thì khi kết thúc kéo thả sẽ gọi API để cập nhật thứ tự mới của Columns vào DB
         * Sau tới Advanced sẽ đưa dữ liệu Board ra ngoài Redux Global Store
         * và lúc này ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những thằng cha phía trên
         * Với việc sử dụng Redux như vậy code sẽ clean, chuẩn chỉnh hơn rất nhiều
         */
        moveColumns(dndOrderedColumns) // gọi API
      }
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  // chạy handleDragStart > collisionDetectionStrategy > handleDragOver > handleDragEnd
  // bản chất của collisionDetectionStrategy trả về mảng
  const collisionDetectionStrategy = useCallback((args) => {
    // closestCorners chỉ bị lỗi khi kéo thả Card, kéo Column không bị nên khi kéo Column vẫn dùng closestCorners
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Tìm các điểm giao nhau với con trỏ
    const pointerIntersections = pointerWithin(args)

    if (!pointerIntersections?.length) return // kéo linh tinh ra ngoài thì ko có va chạm nên sẽ không làm gì cả - pointerIntersections là mảng rỗng

    // Thuật toán phát hiện va chạm sẽ trả về một mảng các va cham ở đây
    // const intersections = !!pointerIntersections?.length
    //     ? pointerIntersections : rectIntersection(args)

    //có va chạm thì xử lí
    // Tìm overId đầu tiên trong 1 nùi các điểm va chạm ở trên
    let overId = getFirstCollision(pointerIntersections, 'id')

    // Cần if vì có thể overId = null, null thì sẽ gặp vấn đề
    if (overId) {
      // over là Column thì tìm tới cái card gần nhất bên trong khu vực va chạm đó dựa vào closestCorners
      // (trong TH này mượt hơn closestCenter), dùng card sẽ ko bị flickering
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        // console.log('overId before: ', overId) //là columnId
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
          })
        })[0]?.id
        // console.log('overId after: ', overId)//lúc này là cardId rồi
      }

      lastOverId.current = overId //lastOverId là 1 ref của useRef
      return [{ id: overId }]
    }

    // nếu overId = null thì sẽ trả về mảng rỗng để tránh crash
    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
    >
      <Box sx={{
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns
          columns={orderedColumns}
          createNewCard={createNewCard}
          deleteColumnDetails={deleteColumnDetails}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>

  )
}

export default BoardContent
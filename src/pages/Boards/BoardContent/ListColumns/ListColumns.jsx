import Box from "@mui/material/Box"
import Column from "./Column/Column"
import Button from "@mui/material/Button"
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

function ListColumns({ columns }) {
  /* SortableContext yêu cầu dữ liệu items là 1 mảng dạng ['id-1', 'id-2'], không phải dạng object.
    nếu không đúng thì vẫn kéo được nhưng ko có animation */
  return (
    <SortableContext items={columns?.map(column => column._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': {m: 2},
      }}>
        {columns?.map(column => <Column key={column._id} column={column} />)}
        
        {/* Add new column */}
        <Box sx={{
          minWidth: '200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: '6px',
          height: 'fit-content',
          bgcolor: '#ffffff3d'
        }}>
          <Button 
            sx={{
              color: 'white',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 1
            }}
            startIcon={<NoteAddIcon />}
          >
            Add new column
          </Button>

        </Box>

      </Box>
    </SortableContext>
    
  );
}

export default ListColumns;
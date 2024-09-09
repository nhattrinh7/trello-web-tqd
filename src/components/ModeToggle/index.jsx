
import { useColorScheme } from '@mui/material';
import Button from "@mui/material/Button"
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button sx={{color: 'gray'}}
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light');
      }}
    >
      {mode === 'light' 
      ? <LightModeIcon fontSize="small"/> 
      : <DarkModeIcon fontSize="small"/>}

      {mode === 'light' ? 'Turn dark' : 'Turn light'}

    </Button>
  )
}


export default ModeToggle
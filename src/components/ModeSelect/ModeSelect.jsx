import { useColorScheme } from '@mui/material'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import './styles.css'

function ModeSelect({ color, textColor }) {
  const { mode, setMode } = useColorScheme()
  if (!mode) {
    return null
  }
  return (
    <Box>
      <Select className={textColor == 'black' ? 'white' : 'other'} sx={{
        height: '38px',
        color: 'white !important',
        border: `1px solid ${color}`,
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: color
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: color
        },
        '& .MuiSelect-icon': {
          color: color
        }
      }}
      value={mode}
      onChange={(event) => setMode(event.target.value)}
      >
        <MenuItem value="system">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500, color: textColor }}>
            <SettingsBrightnessIcon fontSize='small'/>
            System
          </Box>
        </MenuItem>
        <MenuItem value="light">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500, color: textColor }}>
            <LightModeIcon fontSize='small'/> Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500, color: textColor }}>
            <DarkModeIcon fontSize='small'/> Dark
          </Box>
        </MenuItem>
      </Select>
    </Box>
  )
}


export default ModeSelect
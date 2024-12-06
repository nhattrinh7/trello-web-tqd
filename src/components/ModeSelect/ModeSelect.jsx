
import { useColorScheme } from '@mui/material'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  if (!mode) {
    return null
  }
  return (
    <Box>
      <Select sx={{
        height: '38px',
        color: 'purple',
        border: '1px solid purple',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'purple'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'purple'
        },
        '& .MuiSelect-icon': {
          color: 'purple'
        }
        // '.MuiOutlinedInput-root':  { borderColor: 'purple' },
        // '&:hover .MuiOutlinedInput-root': { borderColor: 'purple' },
        // '& fieldset': { borderColor: 'purple' },
        // '&:hover fieldset': { borderColor: 'purple' },
        // // '.MuiSvgicon-root': { color: 'purple' }
      }}
      value={mode}
      onChange={(event) => setMode(event.target.value)}
      >
        <MenuItem value="system">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500, color: 'purple' }}>
            <SettingsBrightnessIcon fontSize='small'/>
            System
          </Box>
        </MenuItem>
        <MenuItem value="light">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500, color: 'purple' }}>
            <LightModeIcon fontSize='small'/> Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500, color: 'purple' }}>
            <DarkModeIcon fontSize='small'/> Dark
          </Box>
        </MenuItem>
      </Select>
    </Box>
  )
}


export default ModeSelect
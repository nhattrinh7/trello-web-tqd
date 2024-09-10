
import { useColorScheme } from '@mui/material';
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  return (
    <Box>
      <Select sx={{height: '38px'}} value={mode} onChange={(event) => setMode(event.target.value)}>
        <MenuItem value="system">
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <SettingsBrightnessIcon fontSize='small'/> System
          </Box>
        </MenuItem>
        <MenuItem value="light">
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <LightModeIcon fontSize='small'/> Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <DarkModeIcon fontSize='small'/> Dark
          </Box>
        </MenuItem>
      </Select>
    </Box>
  )
}


export default ModeToggle
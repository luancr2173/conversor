import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import Converter from './Converter.js';

export default function SpeedDialConverter({ setCoords }) { // Accept setCoords
  const [showConverter, setShowConverter] = React.useState(false);

  return (
    <>
      <Fab
        color="primary"
        aria-label="converter"
        size="small"
        sx={{ position: 'absolute', top: 80, right: 16,}}
        onClick={() => setShowConverter(!showConverter)}
      >
        <TravelExploreIcon />
      </Fab>

      {showConverter && (
        <Box
          sx={{
            position: 'absolute',
            right: 80,
            top: 16,
            width: 300,
            p: 2,
            bgcolor: 'white',
            boxShadow: 3,
            borderRadius: 2,
            zIndex: 9999,
          }}
        >
          <Converter setMapCoords={setCoords} />
        </Box>
      )}
    </>
  );
}

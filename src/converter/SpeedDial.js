import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import Converter from './Converter.js';

/**
 * @typedef {object} SpeedDialConverterProps
 * @property {function(latitude: number, longitude: number): void} setCoords - Uma função de callback para definir as coordenadas do mapa (latitude e longitude) no componente pai.
 */

/**
 * Um componente Speed Dial (botão de ação flutuante) que mostra ou esconde um conversor de coordenadas.
 *
 * Ele utiliza o estado local para controlar a visibilidade do componente {@link Converter}.
 * Quando o botão é clicado, ele alterna o estado de exibição.
 *
 * @param {SpeedDialConverterProps} props - As propriedades do componente.
 * @returns {React.ReactElement} O componente React renderizado, contendo um FAB e o componente Converter (condicionalmente).
 */
export default function SpeedDialConverter({ setCoords }) {
  /**
   * Estado para controlar a visibilidade do componente Converter.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [showConverter, setShowConverter] = React.useState(false);

  return (
    <>
      {/* Botão de Ação Flutuante (FAB) para alternar a visibilidade do Converter */}
      <Fab
        color="primary"
        aria-label="converter"
        size="small"
        sx={{
          position: 'absolute', // Posição absoluta para fixar na tela
          top: 80, // Distância do topo
          right: 16, // Distância da direita
        }}
        onClick={() => setShowConverter(!showConverter)} // Alterna o estado de visibilidade
      >
        {/* Ícone de exploração/viagem */}
        <TravelExploreIcon />
      </Fab>

      {/* Renderização condicional do componente Converter */}
      {showConverter && (
        <Box
          sx={{
            position: 'absolute', // Posição absoluta em relação ao pai
            right: 80,
            top: 16,
            width: 300,
            p: 2, // Preenchimento (padding)
            bgcolor: 'white', // Cor de fundo
            boxShadow: 3, // Sombra
            borderRadius: 2, // Raio da borda
            zIndex: 9999, // Garante que fique acima de outros elementos
          }}
        >
          {/* O componente Converter é renderizado e recebe a função 'setCoords'
            do componente pai, renomeada aqui para 'setMapCoords' por clareza interna.
          */}
          <Converter setMapCoords={setCoords} />
        </Box>
      )}
    </>
  );
}
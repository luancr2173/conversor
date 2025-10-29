import { UtmToDec, GmsToDec } from './converterUtils.js';

// Função auxiliar simulando a máscara do input
const maskInput = (input, mode) => {
  const maxLengths = mode === 'utm' ? [6, 7, 2, 1] : [2, 2, 2, 1];
  let val = input.toUpperCase().replace(/[^0-9NSWE]/g, '');
  let blocks = [];
  let start = 0;
  for (let i = 0; i < maxLengths.length; i++) {
    let block = val.slice(start, start + maxLengths[i]);
    if (block) blocks.push(block);
    start += maxLengths[i];
  }
  return blocks.join(',');
};

describe('Coordinate Converter', () => {

  // --- Testes de máscara ---
  test('UTM: máscara automática', () => {
    const input = '500000464977623S';
    const masked = maskInput(input, 'utm');
    expect(masked).toBe('500000,4649776,23,S');
  });

  test('GMS: máscara automática', () => {
    const input = '15300S';
    const masked = maskInput(input, 'gms');
    expect(masked).toBe('15,30,0,S');
  });

  test('UTM: remove caracteres inválidos', () => {
    const input = '50a0000b,4649c776,2d3,S';
    const masked = maskInput(input, 'utm');
    expect(masked).toBe('500000,4649776,23,S');
  });

  test('GMS: remove caracteres inválidos', () => {
    const input = '15a,30b,0c,S';
    const masked = maskInput(input, 'gms');
    expect(masked).toBe('15,30,0,S');
  });

  // --- Testes de conversão ---
  test('UTM → Decimal', () => {
    const utm = { easting: 500000, northing: 4649776, zone: 23, hemisphere: 'S' };
    const res = UtmToDec(utm);
    expect(res.lat).toBeCloseTo(-17.290006, 5);
    expect(res.lon).toBeCloseTo(-45, 5);
  });

  test('GMS → Decimal', () => {
    const dec = GmsToDec(15, 30, 0, 'S');
    expect(dec).toBeCloseTo(-15.5, 5);
  });

  // --- Testes de erro ---
  test('UTM: input incompleto', () => {
    const input = '500000,4649776,23';
    const masked = maskInput(input, 'utm');
    expect(masked.split(',').length).toBe(3);
  });

  test('GMS: input incompleto', () => {
    const input = '15,30,0';
    const masked = maskInput(input, 'gms');
    expect(masked.split(',').length).toBe(3);
  });

});

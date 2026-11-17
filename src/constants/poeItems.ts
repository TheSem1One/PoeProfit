import { CalculatorState } from '../types';

export const STORAGE_KEY = 'poe1-profit-calculator-data';

export const DEFAULT_CALCULATOR_DATA: CalculatorState = {
  expenses: [
    { id: 'exp_1', name: 'Scarab of Divinity', quantity: 10, price: 5 },
    { id: 'exp_2', name: 'Map', quantity: 5, price: 10 },
    { id: 'exp_3', name: 'Fragment', quantity: 3, price: 15 }
  ],
  profit: [
    { id: 'prof_1', name: 'Divine Orb', quantity: 2, price: 150 },
    { id: 'prof_2', name: 'Chaos Orb', quantity: 50, price: 1 }
  ]
};

export const COMMON_POE_ITEMS = [
  'Divine Orb',
  'Chaos Orb',
  'Exalted Orb',
  'Mirror of Kalandra',
  'Awakened Sextant',
  'Scarab of Divinity',
  'Divination Scarab',
  'Ambush Scarab',
  'Harbinger Scarab',
  'Cartography Scarab',
  'T16 Map',
  'T17 Map (Citadel/Ziggurat)',
  'Shaper Fragment',
  'Elder Fragment',
  'Sirus Fragment',
  'Maven\'s Writ',
  'Simulacrum',
  'Chayula Breachstone',
  'Logbook',
  'Allflame Ember',
  'Valdo\'s Puzzle Box',
  'The Apothecary',
  'The Doctor',
  'House of Mirrors'
];

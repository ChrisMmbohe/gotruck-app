/**
 * Sample Data Module Index
 * Central export point for all sample data and utilities
 */

export * from './routes';
export * from './trucks';
export * from './shipments';
export * from './gps-simulator';

/**
 * Consolidated sample data object for easy access
 */
export const SAMPLE_DATA = {
  trucks: () => {
    const { SAMPLE_TRUCKS } = require('./trucks');
    return SAMPLE_TRUCKS;
  },
  shipments: () => {
    const { SAMPLE_SHIPMENTS } = require('./shipments');
    return SAMPLE_SHIPMENTS;
  },
  corridors: () => {
    const { FREIGHT_CORRIDORS } = require('./routes');
    return FREIGHT_CORRIDORS;
  },
  cities: () => {
    const { MAJOR_CITIES } = require('./routes');
    return MAJOR_CITIES;
  },
};

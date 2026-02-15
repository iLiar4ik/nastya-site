import * as migration_20260215_230401 from './20260215_230401';

export const migrations = [
  {
    up: migration_20260215_230401.up,
    down: migration_20260215_230401.down,
    name: '20260215_230401'
  },
];

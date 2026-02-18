import * as migration_20260218_200856_initial from './20260218_200856_initial';

export const migrations = [
  {
    up: migration_20260218_200856_initial.up,
    down: migration_20260218_200856_initial.down,
    name: '20260218_200856_initial'
  },
];

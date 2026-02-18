import * as migration_20260215_230401 from './20260215_230401';
import * as migration_20260218_193735_init_teacher_collections from './20260218_193735_init_teacher_collections';

export const migrations = [
  {
    up: migration_20260215_230401.up,
    down: migration_20260215_230401.down,
    name: '20260215_230401',
  },
  {
    up: migration_20260218_193735_init_teacher_collections.up,
    down: migration_20260218_193735_init_teacher_collections.down,
    name: '20260218_193735_init_teacher_collections'
  },
];

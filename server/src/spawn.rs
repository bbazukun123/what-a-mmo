use crate::math::DbVector2;
use crate::models::{Monster, user, config, monster};
use spacetimedb::{reducer, table, ReducerContext, ScheduleAt, Table};
use spacetimedb::rand::Rng;

const TARGET_MONSTER_COUNT: usize = 10;

#[reducer]
pub fn spawn_monster(ctx: &ReducerContext, _timer: SpawnMonsterTimer) -> Result<(), String> {
    if ctx.db.user().count() == 0 {
        // Are there no logged in users? Skip monster spawn.
        return Ok(());
    }

    let world_size = ctx
        .db
        .config()
        .id()
        .find(0)
        .ok_or("Config not found")?
        .world_size;

    let mut rng = ctx.rng();
    let mut monster_count = ctx.db.monster().count();
    while monster_count < TARGET_MONSTER_COUNT as u64 {
        let x = rng.gen_range(0.0..world_size as f32);
        let y = rng.gen_range(0.0..world_size as f32);
        ctx.db.monster().try_insert(Monster {
            monster_id: 0,
            position: DbVector2 { x, y },
            direction: DbVector2 { x: 0.0, y: 1.0 },
            speed: 0.0,
            health: 100.0,
        })?;
        monster_count += 1;
    }

    Ok(())
}

#[table(name = spawn_monster_timer, scheduled(spawn_monster))]
pub struct SpawnMonsterTimer {
    #[primary_key]
    #[auto_inc]
    pub scheduled_id: u64,
    pub scheduled_at: ScheduleAt,
}
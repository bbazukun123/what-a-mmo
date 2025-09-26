// Global flag to toggle collision checks
const PASSTHROUGH: bool = true;
use std::time::Duration;
use crate::models::{Config, User, PlayerClass};
use crate::math::DbVector2;

/// Initializes the database and schedules player movement.
#[reducer(init)]
pub fn init(ctx: &ReducerContext) -> Result<(), String> {
    log::info!("Initializing...");
    ctx.db.config().try_insert(Config {
        id: 0,
        world_size: 2160,
    })?;
    ctx.db.spawn_monster_timer().try_insert(SpawnMonsterTimer {
        scheduled_id: 0,
        scheduled_at: ScheduleAt::Interval(Duration::from_millis(500).into()),
    })?;
    ctx.db
        .move_all_players_timer()
        .try_insert(MoveAllPlayersTimer {
            scheduled_id: 0,
            scheduled_at: ScheduleAt::Interval(Duration::from_millis(50).into()),
        })?;
    Ok(())
}

/// Called when a client connects to SpacetimeDB database server
#[reducer(client_connected)]
pub fn client_connected(ctx: &ReducerContext) {
    if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
        ctx.db.user().identity().update(User { online: true, ..user });
    } else {
        let world_size = ctx.db.config().id().find(0)
            .ok_or("Config not found")
            .unwrap()
            .world_size;
        ctx.db.user().insert(User {
            name: None,
            class: None,
            identity: ctx.sender,
            position: DbVector2 { x: world_size as f32 / 2.0, y: world_size as f32 / 2.0 },
            direction: DbVector2 { x: 0.0, y: 1.0 }, // Default facing down
            speed: 0.0,
            online: true,
        });
    }
}

/// Called when a client disconnects from SpacetimeDB database server
#[reducer(client_disconnected)]
pub fn identity_disconnected(ctx: &ReducerContext) {
    if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
        ctx.db.user().identity().update(User { online: false, ..user });
    } else {
        log::warn!("Disconnect event for unknown user with identity {:?}", ctx.sender);
    }
}
/// Clients invoke this reducer to update their movement input.
#[reducer]
pub fn update_player_input(ctx: &ReducerContext, x: i32, y: i32) -> Result<(), String> {
    let mut user = ctx.db.user().identity().find(ctx.sender)
        .ok_or("User not found")?;
    if x != 0 || y != 0 {
        user.direction.x = x as f32;
        user.direction.y = y as f32;
        user.speed = user.direction.magnitude().clamp(0.0, 1.0);
    } else {
        user.speed = 0.0;
    }
    ctx.db.user().identity().update(user);
    Ok(())
}
// All reducers (user, monster, movement, combat, message, init)

use spacetimedb::{table, ScheduleAt, ReducerContext, Table};
use spacetimedb::reducer;
use crate::models::{Message};
use crate::models::{config, user, message};
use crate::spawn::{spawn_monster_timer, SpawnMonsterTimer};

const PLAYER_SIZE: u32 = 100;
const MAX_PLAYER_SPEED: u32 = 10;

/// Timer table for scheduled player movement.
#[table(name = move_all_players_timer, scheduled(move_all_players))]
pub struct MoveAllPlayersTimer {
    /// Primary key for timer.
    #[primary_key]
    #[auto_inc]
    pub scheduled_id: u64,
    /// Scheduled time for movement.
    pub scheduled_at: ScheduleAt,
}

/// Moves all players in the world.
#[reducer]
pub fn move_all_players(ctx: &ReducerContext, _timer: MoveAllPlayersTimer) -> Result<(), String> {
    let world_size = ctx
        .db
        .config()
        .id()
        .find(0)
        .ok_or("Config not found")?
        .world_size;

    // Handle player input with axis-by-axis collision cap
    let online_players: Vec<_> = ctx.db.user().iter().filter(|p| p.online).collect();
    let mut updated_positions = Vec::new();
    for player in online_players.iter() {
        let direction = player.direction * player.speed;
        let mut new_x = player.position.x + direction.x * MAX_PLAYER_SPEED as f32;
        let mut new_y = player.position.y + direction.y * MAX_PLAYER_SPEED as f32;
        let min = PLAYER_SIZE as f32 / 2.0;
        let max = world_size as f32 - PLAYER_SIZE as f32 / 2.0;
        // Clamp X
        new_x = new_x.clamp(min, max);
        let final_x = if PASSTHROUGH {
            new_x
        } else {
            // Check X collision (only online players)
            let mut x_collides = false;
            for other in online_players.iter() {
                if other.identity == player.identity { continue; }
                let dx = new_x - other.position.x;
                let dy = player.position.y - other.position.y;
                let dist = (dx * dx + dy * dy).sqrt();
                if dist < PLAYER_SIZE as f32 {
                    x_collides = true;
                    break;
                }
            }
            if x_collides { player.position.x } else { new_x }
        };

        // Clamp Y
        new_y = new_y.clamp(min, max);
        let final_y = if PASSTHROUGH {
            new_y
        } else {
            // Check Y collision (only online players)
            let mut y_collides = false;
            for other in online_players.iter() {
                if other.identity == player.identity { continue; }
                let dx = final_x - other.position.x;
                let dy = new_y - other.position.y;
                let dist = (dx * dx + dy * dy).sqrt();
                if dist < PLAYER_SIZE as f32 {
                    y_collides = true;
                    break;
                }
            }
            if y_collides { player.position.y } else { new_y }
        };

        updated_positions.push((player.identity, DbVector2 { x: final_x, y: final_y }));
    }
    // Update all online player positions after checking collisions
    for (identity, pos) in updated_positions {
        if let Some(mut player) = ctx.db.user().identity().find(identity) {
            player.position = pos;
            ctx.db.user().identity().update(player);
        }
    }

    Ok(())
}

/// Clients invoke this reducer to send messages.
#[reducer]
pub fn send_message(ctx: &ReducerContext, text: String) -> Result<(), String> {
    if text.is_empty() {
        return Err("Messages must not be empty".to_string());
    }
    ctx.db.message().insert(Message {
        sender: ctx.sender,
        text,
        sent: ctx.timestamp,
    });
    Ok(())
}


/// Clients invoke this reducer to set their name.
#[reducer]
pub fn set_name(ctx: &ReducerContext, name: String) -> Result<(), String> {
    if name.trim().is_empty() {
        return Err("Name must not be empty".to_string());
    }
    let mut user = ctx.db.user().identity().find(ctx.sender)
        .ok_or("User not found")?;
    user.name = Some(name);
    ctx.db.user().identity().update(user);
    Ok(())
}

/// Clients invoke this reducer to set their class.
#[reducer]
pub fn set_class(ctx: &ReducerContext, player_class: PlayerClass) -> Result<(), String> {
    let mut user = ctx.db.user().identity().find(ctx.sender)
        .ok_or("User not found")?;
    user.class = Some(player_class);
    ctx.db.user().identity().update(user);
    Ok(())
}



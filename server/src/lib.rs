pub mod math;

use math::DbVector2;
use std::time::Duration;
use spacetimedb::{table, reducer, Table, ReducerContext, Identity, Timestamp, ScheduleAt};

#[table(name = config, public)]
pub struct Config {
    #[primary_key]
    pub id: u32,
    pub world_size: u64,
}

#[table(name = user, public)]
pub struct User {
    #[primary_key]
    identity: Identity,
    name: Option<String>,
    position: DbVector2,
    direction: DbVector2,
    speed: f32,
    online: bool,
}

#[table(name = message, public)]
pub struct Message {
    sender: Identity,
    sent: Timestamp,
    text: String,
}

#[reducer]
/// Clients invoke this reducer to set their user names.
pub fn set_name(ctx: &ReducerContext, name: String) -> Result<(), String> {
    let name = validate_name(name)?;
    if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
        ctx.db.user().identity().update(User { name: Some(name), ..user });
        Ok(())
    } else {
        Err("Cannot set name for unknown user".to_string())
    }
}

/// Takes a name and checks if it's acceptable as a user's name.
fn validate_name(name: String) -> Result<String, String> {
    if name.is_empty() {
        Err("Names must not be empty".to_string())
    } else {
        Ok(name)
    }
}

// #[reducer]
// /// Clients invoke this reducer to set their user positions.
// pub fn set_position(ctx: &ReducerContext, position: DbVector2) -> Result<(), String> {
//     if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
//         ctx.db.user().identity().update(User { position, ..user });
//         Ok(())
//     } else {
//         Err("Cannot set position for unknown user".to_string())
//     }
// }

#[reducer]
pub fn update_player_input(ctx: &ReducerContext, direction: DbVector2) -> Result<(), String> {
    if let Some(mut player) = ctx.db.user().identity().find(&ctx.sender) {
        player.direction = direction.normalized();
        player.speed = direction.magnitude().clamp(0.0, 1.0);
        ctx.db.user().identity().update(player);
    }
    Ok(())
}

#[table(name = move_all_players_timer, scheduled(move_all_players))]
pub struct MoveAllPlayersTimer {
    #[primary_key]
    #[auto_inc]
    scheduled_id: u64,
    scheduled_at: ScheduleAt,
}

const PLAYER_SIZE: u32 = 150;
const MAX_PLAYER_SPEED: u32 = 10;

#[reducer]
pub fn move_all_players(ctx: &ReducerContext, _timer: MoveAllPlayersTimer) -> Result<(), String> {
    let world_size = ctx
        .db
        .config()
        .id()
        .find(0)
        .ok_or("Config not found")?
        .world_size;

    // Handle player input
    for mut player in ctx.db.user().iter() {
        let direction = player.direction * player.speed;
        let new_pos = player.position + direction * MAX_PLAYER_SPEED as f32;
        let min = PLAYER_SIZE as f32 / 2.0;
        let max = world_size as f32 - PLAYER_SIZE as f32 / 2.0;
        player.position.x = new_pos.x.clamp(min, max);
        player.position.y = new_pos.y.clamp(PLAYER_SIZE as f32, max);
        ctx.db.user().identity().update(player);
    }

    Ok(())
}

#[reducer]
/// Clients invoke this reducer to send messages.
pub fn send_message(ctx: &ReducerContext, text: String) -> Result<(), String> {
    let text = validate_message(text)?;
    log::info!("{}", text);
    ctx.db.message().insert(Message {
        sender: ctx.sender,
        text,
        sent: ctx.timestamp,
    });
    Ok(())
}

/// Takes a message's text and checks if it's acceptable to send.
fn validate_message(text: String) -> Result<String, String> {
    if text.is_empty() {
        Err("Messages must not be empty".to_string())
    } else {
        Ok(text)
    }
}

#[reducer(init)]
pub fn init(ctx: &ReducerContext) -> Result<(), String> {
    log::info!("Initializing...");
    ctx.db.config().try_insert(Config {
        id: 0,
        world_size: 1080,
    })?;
    ctx.db
        .move_all_players_timer()
        .try_insert(MoveAllPlayersTimer {
            scheduled_id: 0,
            scheduled_at: ScheduleAt::Interval(Duration::from_millis(50).into()),
        })?;
    Ok(())
}

#[reducer(client_connected)]
// Called when a client connects to a SpacetimeDB database server
pub fn client_connected(ctx: &ReducerContext) {
    if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
        // If this is a returning user, i.e. we already have a `User` with this `Identity`,
        // set `online: true`, but leave `name` and `identity` unchanged.
        ctx.db.user().identity().update(User { online: true, ..user });
    } else {
        // If this is a new user, create a `User` row for the `Identity`,
        // which is online, but hasn't set a name.
        ctx.db.user().insert(User {
            name: None,
            identity: ctx.sender,
            position: DbVector2 { x: 540.0, y: 540.0 }, // Default position, can be updated later
            direction: DbVector2 { x: 0.0, y: 0.0 }, // Default direction, can be updated later
            speed: 0.0,   // Default speed, can be updated later
            online: true,
        });
    }
}

#[reducer(client_disconnected)]
// Called when a client disconnects from SpacetimeDB database server
pub fn identity_disconnected(ctx: &ReducerContext) {
    if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
        ctx.db.user().identity().update(User { online: false, ..user });
    } else {
        // This branch should be unreachable,
        // as it doesn't make sense for a client to disconnect without connecting first.
        log::warn!("Disconnect event for unknown user with identity {:?}", ctx.sender);
    }
}
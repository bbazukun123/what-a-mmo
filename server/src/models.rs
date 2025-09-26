// Table definitions for Config, User, Message
use crate::math::DbVector2;
use spacetimedb::{table, Identity, Timestamp};

/// Configuration table for world settings.
#[table(name = config, public)]
pub struct Config {
    /// Primary key.
    #[primary_key]
    pub id: u32,
    /// Size of the world.
    pub world_size: u64,
}

/// Player class type.
#[derive(spacetimedb::SpacetimeType, Debug, Clone, Copy, PartialEq, Eq)]
pub enum PlayerClass {
    Ranger,
    Melee,
}

/// User table representing a player.
#[table(name = user, public)]
pub struct User {
    /// Primary key: user identity.
    #[primary_key]
    pub identity: Identity,
    /// Optional player name.
    pub name: Option<String>,
    /// Player position in the world.
    pub position: DbVector2,
    /// Player movement direction.
    pub direction: DbVector2,
    /// Player movement speed.
    pub speed: f32,
    /// Online status.
    pub online: bool,
    /// Player class (ranger or melee).
    pub class: Option<PlayerClass>,
}

/// Message table for chat messages.
#[table(name = message, public)]
pub struct Message {
    /// Sender identity.
    pub sender: Identity,
    /// Timestamp when sent.
    pub sent: Timestamp,
    /// Message text.
    pub text: String,
}

/// Monster table for monster entities.
#[table(name = monster, public)]
pub struct Monster {
    /// Primary key: monster identity.
    #[primary_key]
    pub monster_id: u32,
    /// Monster position in the world.
    pub position: DbVector2,
    /// Monster movement direction.
    pub direction: DbVector2,
    /// Monster movement speed.
    pub speed: f32,
    /// Monster health value.
    pub health: f32,
}

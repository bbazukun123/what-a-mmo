// Player struct and logic
use crate::models::User;
use crate::traits::{Movable, Attackable};
use crate::math::DbVector2;

/// Represents a player entity in the game.
pub struct Player {
    /// User data for the player.
    pub user: User,
    /// Player health value.
    pub health: f32,
}

impl Movable for Player {
    /// Returns the player's position.
    fn position(&self) -> &DbVector2 { &self.user.position }
    /// Returns the player's direction.
    fn direction(&self) -> &DbVector2 { &self.user.direction }
    /// Returns the player's speed.
    fn speed(&self) -> f32 { self.user.speed }
    /// Sets the player's position.
    fn set_position(&mut self, pos: DbVector2) { self.user.position = pos; }
    /// Sets the player's direction.
    fn set_direction(&mut self, dir: DbVector2) { self.user.direction = dir; }
    /// Sets the player's speed.
    fn set_speed(&mut self, speed: f32) { self.user.speed = speed; }
}

impl Attackable for Player {
    /// Returns the player's health.
    fn health(&self) -> f32 { self.health }
    /// Sets the player's health.
    fn set_health(&mut self, health: f32) { self.health = health; }
    /// Attacks another entity, applying damage.
    fn attack(&mut self, target: &mut dyn Attackable, damage: f32) {
        target.set_health(target.health() - damage);
    }
}

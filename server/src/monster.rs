// Monster struct and logic
use crate::traits::{Movable, Attackable};
use crate::math::DbVector2;

/// Represents a monster entity in the game.
pub struct Monster {
    /// Monster position in the world.
    pub position: DbVector2,
    /// Monster movement direction.
    pub direction: DbVector2,
    /// Monster movement speed.
    pub speed: f32,
    /// Monster health value.
    pub health: f32,
}

impl Movable for Monster {
    /// Returns the monster's position.
    fn position(&self) -> &DbVector2 { &self.position }
    /// Returns the monster's direction.
    fn direction(&self) -> &DbVector2 { &self.direction }
    /// Returns the monster's speed.
    fn speed(&self) -> f32 { self.speed }
    /// Sets the monster's position.
    fn set_position(&mut self, pos: DbVector2) { self.position = pos; }
    /// Sets the monster's direction.
    fn set_direction(&mut self, dir: DbVector2) { self.direction = dir; }
    /// Sets the monster's speed.
    fn set_speed(&mut self, speed: f32) { self.speed = speed; }
}

impl Attackable for Monster {
    /// Returns the monster's health.
    fn health(&self) -> f32 { self.health }
    /// Sets the monster's health.
    fn set_health(&mut self, health: f32) { self.health = health; }
    /// Attacks another entity, applying damage.
    fn attack(&mut self, target: &mut dyn Attackable, damage: f32) {
        target.set_health(target.health() - damage);
    }
}

// Common traits for entities
use crate::math::DbVector2;

/// Trait for movable entities (players, monsters).
pub trait Movable {
    /// Returns the entity's position.
    fn position(&self) -> &DbVector2;
    /// Returns the entity's direction.
    fn direction(&self) -> &DbVector2;
    /// Returns the entity's speed.
    fn speed(&self) -> f32;
    /// Sets the entity's position.
    fn set_position(&mut self, pos: DbVector2);
    /// Sets the entity's direction.
    fn set_direction(&mut self, dir: DbVector2);
    /// Sets the entity's speed.
    fn set_speed(&mut self, speed: f32);
}

/// Trait for entities that can be attacked.
pub trait Attackable {
    /// Returns the entity's health.
    fn health(&self) -> f32;
    /// Sets the entity's health.
    fn set_health(&mut self, health: f32);
    /// Attacks another entity, applying damage.
    fn attack(&mut self, target: &mut dyn Attackable, damage: f32);
}

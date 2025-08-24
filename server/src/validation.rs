// All validation functions

// Validation functions for name and message

/// Validates a user name.
/// Returns Ok(name) if valid, or Err with a message if invalid.
pub fn validate_name(name: String) -> Result<String, String> {
    if name.is_empty() {
        Err("Names must not be empty".to_string())
    } else {
        Ok(name)
    }
}

/// Validates a chat message.
/// Returns Ok(text) if valid, or Err with a message if invalid.
pub fn validate_message(text: String) -> Result<String, String> {
    if text.is_empty() {
        Err("Messages must not be empty".to_string())
    } else {
        Ok(text)
    }
}

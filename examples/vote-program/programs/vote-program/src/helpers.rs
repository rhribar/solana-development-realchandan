use anchor_lang::{prelude::*, solana_program::clock::Clock};
use std::convert::TryInto;

pub fn get_unix_timestamp() -> Result<u64> {
    Ok(Clock::get()?.unix_timestamp.try_into().unwrap())
}

#[error_code]
pub enum VoteError {
    #[msg("registration time is over")]
    RegistrationPeriodOver,
    #[msg("You have already casted your vote")]
    AlreadyVoted,
}

use anchor_lang::prelude::*;

use crate::helpers::{get_unix_timestamp, VoteError};

#[account(zero_copy)]
pub struct PollInfo {
    pub reg_start: u64,   // 8
    pub reg_end: u64,     // 8
    pub vote_start: u64,  // 8
    pub vote_end: u64,    // 8
    pub info: [u64; 256], // 8 * 256 = 2048 bytes
}

#[account]
pub struct VoteUser {
    pub user_key: Pubkey,           // 32
    pub registration_time: u64,     // 8
    pub who_has_they_voted_for: u8, // 1
    pub has_voted: bool,            // 1
}

#[derive(Accounts)]
#[instruction(seeds: [u8; 8])]
pub struct CreateNewPoll<'info> {
    #[account(init,seeds=[&seeds],bump, payer=payer, space=8+8+8+8+8+(8*256))]
    pub poll_info: AccountLoader<'info, PollInfo>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterForVoting<'info> {
    #[account(init,seeds=[&payer.to_account_info().key.clone().to_bytes()],bump, payer=payer, space=8+32+8+1+1+1)]
    pub vote_user: Account<'info, VoteUser>,

    pub poll_info: AccountLoader<'info, PollInfo>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VoteAccounts<'info> {
    #[account(mut)]
    pub vote_user: Account<'info, VoteUser>,

    pub poll_info: AccountLoader<'info, PollInfo>,

    #[account(mut)]
    pub payer: Signer<'info>,
}

impl<'info> RegisterForVoting<'info> {
    pub fn checks(ctx: &Context<RegisterForVoting<'info>>) -> Result<()> {
        let current_time = get_unix_timestamp()?;
        let vote_info = ctx.accounts.poll_info.load_mut()?;
        if (current_time >= vote_info.reg_start) && (current_time <= vote_info.reg_end) {
            Ok(())
        } else {
            err!(VoteError::RegistrationPeriodOver)
        }
    }
}

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub enum Entries {
    SomebodyElse,
    MrBeast,
    RyanTrahan,
    Airrack,
    YesTheory,
}

pub fn entry_enum_to_u8(entry: Entries) -> u8 {
    entry as u8
}

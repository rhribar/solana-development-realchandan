use anchor_lang::prelude::*;

use account::*;
use helpers::*;

mod account;
mod helpers;

declare_id!("2emzK8JAJ2aUaW3NHjjcY1iyCWgDcSEWFepqhSqieYPA");

#[program]
pub mod vote_program {
    use super::*;

    pub fn create_new_poll(
        ctx: Context<CreateNewPoll>,
        _seeds: [u8; 8],
        reg_start: u64,
        reg_end: u64,
        vote_start: u64,
        vote_end: u64,
    ) -> Result<()> {
        let mut account = ctx.accounts.poll_info.load_mut()?;
        account.reg_start = reg_start;
        account.reg_end = reg_end;
        account.vote_start = vote_start;
        account.vote_end = vote_end;
        account.vote_end = vote_end;
        account.info = [0u64; 256];
        Ok(())
    }

    #[access_control(RegisterForVoting::checks(&ctx))]
    pub fn register_for_voting(ctx: Context<RegisterForVoting>) -> Result<()> {
        let current_time = get_unix_timestamp()?;
        let account = &mut ctx.accounts.vote_user;
        account.registration_time = current_time;
        Ok(())
    }

    pub fn vote(ctx: Context<VoteAccounts>, who_they_wanna_vote_for: Entries) -> Result<()> {
        let current_time = get_unix_timestamp()?;
        let vote_user = &mut ctx.accounts.vote_user;
        if vote_user.has_voted {
            return err!(VoteError::AlreadyVoted);
        }
        let mut vote_info = ctx.accounts.poll_info.load_mut()?;
        let entry_to_u8 = entry_enum_to_u8(who_they_wanna_vote_for);
        if (current_time > vote_info.vote_start) || (current_time < vote_info.vote_start) {
            vote_user.who_has_they_voted_for = entry_to_u8;
        }
        vote_info.info[entry_to_u8 as usize] = vote_info.info[entry_to_u8 as usize] + 1;
        Ok(())
    }
}

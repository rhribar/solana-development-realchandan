use anchor_lang::prelude::*;

declare_id!("B1oggzHNyvXVTxqfw64pXogzbAvGFM7DqEbDakyGu25D");

#[program]
pub mod blog {
    use super::*;

    pub fn create_post(_ctx: Context<CreatePost>, _seeds_to_use: [u8; 8]) -> Result<()> {
        Ok(())
    }

    pub fn update_post(
        ctx: Context<UpdatePost>,
        title: [u8; 32],
        description: [u8; 64],
        content: [u8; 512],
    ) -> Result<()> {
        let mut account = ctx.accounts.account_data.load_mut()?;
        account.title = title;
        account.description = description;
        account.content = content;
        Ok(())
    }

    pub fn delete_post(ctx: Context<DeletePost>) -> Result<()> {
        let mut account = ctx.accounts.account_data.load_mut()?;
        account.title = [0u8; 32];
        account.description = [0u8; 64];
        account.content = [0u8; 512];
        Ok(())
    }
}

#[account(zero_copy)]
pub struct BlogPost {
    pub title: [u8; 32],
    pub description: [u8; 64],
    pub content: [u8; 512],
}

#[derive(Accounts)]
#[instruction(seeds_to_use: [u8; 8])]
pub struct CreatePost<'info> {
    #[account(init,seeds=[&seeds_to_use],bump,payer=payyer, space=8+32+64+512 )]
    pub account_data: AccountLoader<'info, BlogPost>,

    #[account(mut)]
    pub payyer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePost<'info> {
    #[account(mut)]
    pub account_data: AccountLoader<'info, BlogPost>,

    #[account(mut)]
    pub payyer: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeletePost<'info> {
    #[account(mut)]
    pub account_data: AccountLoader<'info, BlogPost>,

    #[account(mut)]
    pub payyer: Signer<'info>,
}

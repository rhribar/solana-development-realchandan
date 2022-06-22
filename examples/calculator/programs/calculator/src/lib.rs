use anchor_lang::prelude::*;

declare_id!("Ca1cea21QUucyfugc8eY9kqVyofbm32Mz6zs1XdwmZYa");

#[program]
pub mod calculator {
    use super::*;

    pub fn create_account(_ctx: Context<CreateAccount>) -> Result<()> {
        Ok(())
    }

    pub fn calculate(
        ctx: Context<CalculateAccounts>,
        perform: PerformSomeCalculation,
        x: f64,
        y: f64,
    ) -> Result<()> {
        let account = &mut ctx.accounts.account;
        match perform {
            PerformSomeCalculation::Addition => account.result = x + y,
            PerformSomeCalculation::Subtraction => account.result = x - y,
            PerformSomeCalculation::Multiplication => account.result = x * y,
            PerformSomeCalculation::Division => account.result = x / y,
        }
        Ok(())
    }
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub enum PerformSomeCalculation {
    Addition,
    Subtraction,
    Multiplication,
    Division,
}

#[derive(Accounts)]
pub struct CreateAccount<'info> {
    #[account(init,space=8+16, payer=payer)]
    pub account: Account<'info, AccountData>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CalculateAccounts<'info> {
    #[account(mut)]
    pub account: Account<'info, AccountData>,

    #[account(mut)]
    pub payer: Signer<'info>,
}

#[account]
pub struct AccountData {
    pub result: f64,
}

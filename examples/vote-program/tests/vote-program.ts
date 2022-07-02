import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { VoteProgram } from "../target/types/vote_program";
import { PublicKey } from "@solana/web3.js";
import { transfer } from "@solana/spl-token";

describe("vote-program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.VoteProgram as Program<VoteProgram>;

  const current_time = Math.round(Date.now() / 1000);

  const payer = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([
      244, 226, 83, 156, 243, 47, 93, 223, 1, 170, 155, 138, 214, 56, 77, 199,
      86, 129, 78, 64, 225, 205, 6, 212, 208, 9, 118, 35, 149, 179, 230, 146,
      142, 150, 191, 249, 45, 133, 152, 129, 131, 153, 155, 104, 145, 77, 121,
      234, 6, 24, 205, 238, 36, 80, 149, 70, 48, 147, 19, 132, 144, 101, 95, 5
    ])
  );

  it("create new poll", async () => {
    const tx = await program.methods
      .createNewPoll(
        get_seeds("abcd1234"),
        new anchor.BN(current_time + 3 * 60),
        new anchor.BN(current_time + 13 * 60),
        new anchor.BN(current_time + 15 * 60),
        new anchor.BN(current_time + 30 * 60)
      )
      .accounts({
        pollInfo: PublicKey.findProgramAddressSync(
          [Uint8Array.from(get_seeds("abcd1234"))],
          program.programId
        )[0],
        payer: payer.publicKey
      })
      .rpc();
  });
});

function get_seeds(seed_str: any) {
  return [...seed_str].map((char) => char.codePointAt());
}

import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Calculator } from "../target/types/calculator";

describe("calculator", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Calculator as Program<Calculator>;

  const kp = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([
      210, 185, 169, 170, 124, 116, 139, 118, 54, 36, 43, 17, 76, 56, 92, 61,
      72, 59, 72, 169, 145, 11, 164, 235, 212, 247, 10, 56, 189, 147, 173, 202,
      147, 36, 85, 32, 174, 138, 40, 177, 241, 225, 176, 119, 123, 42, 120, 155,
      88, 103, 248, 172, 95, 111, 61, 77, 36, 100, 56, 212, 103, 243, 8, 88
    ])
  );

  it("create account", async () => {
    const tx = await program.methods
      .createAccount()
      .accounts({
        account: kp.publicKey
      })
      .signers([kp])
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("perform some calculation", async () => {
    // Add your test here.
    const tx = await program.methods
      .calculate({ addition: {} }, new anchor.BN(100.05), new anchor.BN(45.45))
      .accounts({
        account: kp.publicKey,
        payer: kp.publicKey
      })
      .signers([kp])
      .rpc();
    console.log("Your transaction signature", tx);
  });
});

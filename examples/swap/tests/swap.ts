import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Swap } from "../target/types/swap";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  createMint,
  createAccount,
  mintTo,
  getAssociatedTokenAddress,
  transfer
} from "@solana/spl-token";

anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.Swap as Program<Swap>;

describe("swap", () => {
  const connection = new Connection("http://localhost:8899");

  const mint_t1_kp = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([
      48, 132, 23, 187, 134, 193, 97, 31, 86, 208, 25, 84, 78, 246, 56, 127,
      188, 54, 66, 119, 119, 248, 227, 68, 218, 159, 207, 43, 88, 110, 207, 184,
      6, 169, 129, 50, 92, 89, 228, 16, 164, 24, 202, 4, 8, 253, 156, 107, 46,
      21, 190, 170, 252, 149, 195, 52, 229, 178, 39, 215, 57, 10, 105, 108
    ])
  );

  const mint_t2_kp = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([
      230, 180, 59, 254, 76, 85, 254, 214, 58, 176, 184, 193, 185, 186, 9, 165,
      109, 232, 37, 56, 76, 136, 4, 255, 11, 187, 237, 168, 247, 180, 59, 168,
      6, 170, 153, 8, 203, 122, 109, 234, 92, 155, 4, 137, 226, 253, 152, 24,
      187, 15, 162, 196, 229, 200, 101, 157, 232, 136, 94, 129, 190, 251, 252,
      145
    ])
  );

  const payer = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([
      20, 73, 93, 142, 5, 199, 150, 242, 122, 217, 23, 33, 62, 12, 6, 107, 35,
      157, 91, 174, 35, 28, 204, 86, 93, 191, 193, 220, 76, 134, 13, 241, 177,
      204, 92, 187, 147, 213, 214, 183, 164, 93, 191, 219, 253, 174, 64, 183,
      101, 76, 9, 17, 214, 11, 170, 190, 242, 80, 182, 115, 97, 81, 149, 1
    ])
  );

  const seeds_one = get_seeds("vcdfgtre");
  const seeds_two = get_seeds("asdewqas");
  const seeds_three = get_seeds("kiuhyrfg");
  const seeds_four = get_seeds("pool_owner");
  const [pda1, bump1] = getPdaFromSeeds(seeds_one);
  const [pda2, bump2] = getPdaFromSeeds(seeds_two);
  const [pda3, bump3] = getPdaFromSeeds(seeds_three);
  const [pda4, bump4] = getPdaFromSeeds(seeds_four);

  console.log(
    `Pda 1 - ${pda1} & bump1 - ${bump1}\nPda 2 - ${pda2} & bump2 - ${bump2}\nPda 3 - ${pda3} & bump3 - ${bump3}\nPda 4 - ${pda4} & bump4 - ${bump4}`
  );

  it("mint the tokens", async () => {
    const mint_pk1 = await createMint(
      connection,
      payer,
      payer.publicKey,
      payer.publicKey,
      0,
      mint_t1_kp
    );
    console.log(`Mint - ${mint_pk1}`);
    //
    const mint_pk2 = await createMint(
      connection,
      payer,
      payer.publicKey,
      payer.publicKey,
      0,
      mint_t2_kp
    );
    console.log(`Mint - ${mint_pk2}`);
  });

  it("create token accounts", async () => {
    const token_user_t1_pk = await createAccount(
      connection,
      payer,
      mint_t1_kp.publicKey,
      payer.publicKey
    );
    console.log(
      `Newly created ata - ${token_user_t1_pk} for mint - ${mint_t1_kp.publicKey}`
    );
    //
    const token_user_t2_pk = await createAccount(
      connection,
      payer,
      mint_t2_kp.publicKey,
      payer.publicKey
    );
    console.log(
      `Newly created ata - ${token_user_t2_pk} for mint - ${mint_t1_kp.publicKey}`
    );
  });

  it("mint tokens", async () => {
    const amount = 10000;
    //
    const ata_user_t1_pk = await getAssociatedTokenAddress(
      mint_t1_kp.publicKey,
      payer.publicKey
    );
    const tx1 = await mintTo(
      connection,
      payer,
      mint_t1_kp.publicKey,
      ata_user_t1_pk,
      payer,
      1000
    );
    console.log(
      `MintTo - ${amount} tokens of mint - ${mint_t1_kp.publicKey} were minted to - ${ata_user_t1_pk}\ntx hash - ${tx1}`
    );
    //
    const ata_user_t2_pk = await getAssociatedTokenAddress(
      mint_t2_kp.publicKey,
      payer.publicKey
    );
    const tx2 = await mintTo(
      connection,
      payer,
      mint_t2_kp.publicKey,
      ata_user_t2_pk,
      payer,
      1000
    );
    console.log(
      `MintTo - ${amount} tokens of mint - ${mint_t2_kp.publicKey} were minted to - ${ata_user_t2_pk}\ntx hash - ${tx2}`
    );
  });

  it("create pool", async () => {
    try {
      const tx = await program.methods
        .createPool(
          seeds_one,
          seeds_two,
          seeds_three,
          seeds_four,
          new anchor.BN(10)
        )
        .accounts({
          pool: pda1,
          payer: payer.publicKey,
          token1Mint: mint_t1_kp.publicKey,
          token1Pool: pda2,
          token2Mint: mint_t2_kp.publicKey,
          token2Pool: pda3,
          poolOwner: pda4
        })
        .signers([payer])
        .rpc();
      console.log("Your transaction signature", tx);
    } catch (e) {
      console.log(e);
    }
  });

  it("transfer tokens to newly created pda token accounts", async () => {
    const amount = 500;
    const ata_user_t1_pk = await getAssociatedTokenAddress(
      mint_t1_kp.publicKey,
      payer.publicKey
    );
    const tx1 = await transfer(
      connection,
      payer,
      ata_user_t1_pk,
      pda2,
      payer,
      amount
    );
    console.log(
      `Amount - ${amount} were transferred from - ${ata_user_t1_pk} to pda - ${pda2}\ntx hash - ${tx1}`
    );
    //
    const ata_user_t2_pk = await getAssociatedTokenAddress(
      mint_t2_kp.publicKey,
      payer.publicKey
    );
    const tx2 = await transfer(
      connection,
      payer,
      ata_user_t2_pk,
      pda3,
      payer,
      amount
    );
    console.log(
      `Amount - ${amount} were transferred from - ${ata_user_t2_pk} to pda - ${pda3}\ntx hash - ${tx2}`
    );
  });

  it("swap t1 for t2", async () => {
    try {
      const swap = {
        token2ForToken1: { amount: new anchor.BN(50) }
      };
      const ata_user_t1_pk = await getAssociatedTokenAddress(
        mint_t1_kp.publicKey,
        payer.publicKey
      );
      const ata_user_t2_pk = await getAssociatedTokenAddress(
        mint_t2_kp.publicKey,
        payer.publicKey
      );
      const tx = await program.methods
        .swapToken(bump4, swap)
        .accounts({
          user: payer.publicKey,
          pool: pda1,
          userToken1: ata_user_t1_pk,
          userToken2: ata_user_t2_pk,
          token1Pool: pda2,
          token2Pool: pda3,
          poolOwner: pda4
        })
        .signers([payer])
        .rpc();
      console.log("Your transaction signature", tx);
    } catch (e) {
      console.log(e);
    }
  });
});

function getPda(seed_str: any) {
  return getPdaFromSeeds(get_seeds(seed_str));
}

function getPdaFromSeeds(seeds: any) {
  return PublicKey.findProgramAddressSync(
    [Uint8Array.from(seeds)],
    program.programId
  );
}

function get_seeds(seed_str: any) {
  return [...seed_str].map((char) => char.codePointAt());
}

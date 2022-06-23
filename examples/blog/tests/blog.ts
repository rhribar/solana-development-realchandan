import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Blog } from "../target/types/blog";
import { PublicKey } from "@solana/web3.js";

async function create_post_account(
  program: Program<Blog>,
  pda: PublicKey,
  kp: anchor.web3.Keypair,
  seeds_to_use: Uint8Array
) {
  const tx = await program.methods
    .createPost(Array.from(seeds_to_use))
    .accounts({
      accountData: pda,
      payyer: kp.publicKey
    })
    .signers([kp])
    .rpc();

  console.log("Your transaction signature", tx);
}

async function update_post_account(
  program: Program<Blog>,
  pda: PublicKey,
  kp: anchor.web3.Keypair,
  title: String,
  description: String,
  content: String
) {
  const tx = await program.methods
    .updatePost(
      fill_rest_with_zeros(title, 32),
      fill_rest_with_zeros(description, 64),
      fill_rest_with_zeros(content, 512)
    )
    .accounts({
      accountData: pda,
      payyer: kp.publicKey
    })
    .signers([kp])
    .rpc();
  console.log("Your transaction signature", tx);
}

describe("blog", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Blog as Program<Blog>;

  const kp = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([
      246, 181, 49, 53, 63, 205, 26, 230, 170, 107, 207, 191, 178, 74, 31, 170,
      33, 139, 93, 53, 125, 195, 55, 214, 234, 110, 2, 81, 159, 107, 215, 144,
      196, 216, 41, 251, 230, 81, 148, 150, 78, 21, 196, 191, 56, 138, 120, 67,
      29, 139, 178, 233, 200, 56, 134, 170, 145, 124, 150, 28, 156, 120, 174,
      233
    ])
  );

  const seeds_to_use1 = Uint8Array.from([97, 98, 99, 100, 49, 50, 51, 52]);
  const seeds_to_use2 = Uint8Array.from([97, 98, 99, 100, 49, 50, 51, 53]);
  const seeds_to_use3 = Uint8Array.from([97, 98, 99, 100, 49, 50, 51, 54]);

  const pda1 = PublicKey.findProgramAddressSync(
    [seeds_to_use1],
    program.programId
  )[0];

  const pda2 = PublicKey.findProgramAddressSync(
    [seeds_to_use2],
    program.programId
  )[0];

  const pda3 = PublicKey.findProgramAddressSync(
    [seeds_to_use3],
    program.programId
  )[0];

  it("create post account[s]", async () => {
    await create_post_account(program, pda1, kp, seeds_to_use1);
    await create_post_account(program, pda2, kp, seeds_to_use2);
    await create_post_account(program, pda3, kp, seeds_to_use3);
  });

  it("update post", async () => {
    await update_post_account(
      program,
      pda1,
      kp,
      "Best programming language",
      "In this blog post i discuss about the best programming language",
      "the best programming language in the world is - Idk! it depends on your use case, for web it's maybe javascript, for android it's maybe java, for solana development it's probobably rust."
    );
    await update_post_account(
      program,
      pda2,
      kp,
      "Elon Musk",
      "A blog post about elon musk",
      "Elon Reeve Musk FRS (born June 28, 1971) is a business magnate and investor. He is the founder, CEO, and Chief Engineer at SpaceX; angel investor, CEO, and Product Architect of Tesla, Inc.; founder of The Boring Company; and co-founder of Neuralink and OpenAI. With an estimated net worth of around US$203 billion as of June 2022,[4] Musk is the wealthiest person in the world according to both the Bloomberg Billionaires Index and the Forbes real-time billionaires list. - from wikipedia"
    );
    await update_post_account(
      program,
      pda3,
      kp,
      "Solana",
      "This is a blog post about solana",
      "Solana is a public blockchain platform with smart contract functionality. It is a Web-Scale Blockchain for fast, secure, scalable, decentralized apps and marketplaces. Solana smart contracts aka programs can be developed using anchor + rust."
    );
  });

  // it("delete post", async () => {
  //   const tx = await program.methods.initialize().rpc();
  //   console.log("Your transaction signature", tx);
  // });
});

function fill_rest_with_zeros(stringgg, desired_size) {
  var a = Array(desired_size - stringgg.length)
    .fill(0)
    .map((_, i) => 0);

  var b = [...stringgg].map((char) => char.codePointAt());

  Array.prototype.push.apply(a, b);

  return a;
}

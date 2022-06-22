import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Blog } from "../target/types/blog";
import { PublicKey } from "@solana/web3.js";

describe("blog", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Blog as Program<Blog>;

  const kp = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([
      94, 150, 38, 198, 185, 4, 225, 12, 247, 249, 15, 13, 199, 97, 42, 188,
      250, 89, 207, 117, 112, 229, 139, 64, 94, 181, 124, 10, 156, 79, 195, 151,
      156, 174, 46, 246, 104, 70, 225, 27, 101, 19, 149, 84, 141, 81, 6, 154,
      100, 132, 43, 215, 48, 245, 51, 123, 102, 188, 181, 184, 47, 215, 218, 121
    ])
  );
  // abcd1234
  const seeds_to_use = Uint8Array.from([97, 98, 99, 100, 49, 50, 51, 52]);

  const pda = PublicKey.findProgramAddressSync(
    [seeds_to_use],
    program.programId
  );

  // it("create post account", async () => {
  //   const tx = await program.methods
  //     .createPost(seeds_to_use)
  //     .accounts({
  //       accountData: pda[0],
  //       payyer: kp.publicKey
  //     })
  //     .signers([kp])
  //     .rpc();

  //   console.log("Your transaction signature", tx);
  // });

  it("update post", async () => {
    const tx = await program.methods
      .updatePost(
        fill_rest_with_zeros("Best programming language", 32),
        fill_rest_with_zeros(
          "In this blog post i discuss about the best programming language",
          64
        ),
        fill_rest_with_zeros(
          "the best programming language in the world is - Idk! it depends on your use case, for web it's maybe javascript, for andorid it's java, for solana development it's probobably rust.",
          512
        )
      )
      .accounts({
        accountData: pda[0],
        payyer: kp.publicKey
      })
      .signers([kp])
      .rpc();
    console.log("Your transaction signature", tx);
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

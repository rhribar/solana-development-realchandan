import { Keypair, Connection } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";

(async () => {
  const connection = new Connection("http://localhost:8899");

  const keypair = Keypair.fromSecretKey(
    Uint8Array.from([
      7, 152, 251, 249, 75, 154, 94, 35, 64, 41, 236, 240, 6, 132, 14, 220, 112,
      154, 248, 164, 253, 175, 160, 218, 157, 242, 126, 96, 83, 157, 120, 227,
      76, 164, 201, 213, 68, 127, 84, 197, 114, 226, 249, 132, 156, 52, 191,
      163, 33, 90, 212, 45, 27, 133, 26, 41, 45, 229, 210, 97, 6, 50, 161, 220
    ])
  );

  const mint_address = await createMint(
    connection,
    keypair,
    keypair.publicKey,
    keypair.publicKey,
    2,
    Keypair.fromSecretKey(
      Uint8Array.from([
        86, 1, 140, 203, 187, 11, 44, 168, 181, 6, 158, 173, 231, 209, 149, 78,
        126, 113, 11, 176, 127, 46, 40, 97, 64, 21, 16, 150, 240, 251, 122, 164,
        142, 151, 61, 57, 128, 16, 109, 147, 173, 5, 191, 226, 234, 35, 123,
        153, 74, 160, 106, 204, 99, 35, 135, 179, 255, 40, 231, 102, 62, 246,
        205, 66
      ])
    )
  );

  console.log(mint_address.publicKey);
})();

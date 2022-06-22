import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import { createAccount } from "@solana/spl-token";

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

  const keypair_token = Keypair.generate();

  console.log(keypair_token.publicKey.toBase58());
  console.log(keypair_token.secretKey);

  const pk = await createAccount(
    connection,
    keypair,
    new PublicKey("Abcego7AGG4QWbKDRxUnFTNxcjdQp2y5oRXLJjTofuys"),
    keypair.publicKey,
    keypair_token
  );

  console.log(pk.publicKey.toBase58());
})();

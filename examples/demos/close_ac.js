import { Keypair, Connection } from "@solana/web3.js";
import { closeAccount } from "@solana/spl-token";

(async () => {
  const connection = new Connection("http://localhost:8899");

  const master_key = Keypair.fromSecretKey(
    Uint8Array.from([
      7, 152, 251, 249, 75, 154, 94, 35, 64, 41, 236, 240, 6, 132, 14, 220, 112,
      154, 248, 164, 253, 175, 160, 218, 157, 242, 126, 96, 83, 157, 120, 227,
      76, 164, 201, 213, 68, 127, 84, 197, 114, 226, 249, 132, 156, 52, 191,
      163, 33, 90, 212, 45, 27, 133, 26, 41, 45, 229, 210, 97, 6, 50, 161, 220
    ])
  );

  const keypair_of_token_account_just_created_moments_ago =
    Keypair.fromSecretKey(
      Uint8Array.from([
        57, 230, 61, 199, 90, 30, 20, 140, 178, 176, 188, 44, 19, 119, 23, 225,
        74, 38, 112, 168, 60, 4, 136, 131, 16, 179, 81, 91, 123, 192, 97, 20,
        60, 224, 66, 50, 206, 203, 133, 154, 110, 27, 37, 237, 131, 69, 45, 232,
        43, 5, 85, 240, 234, 41, 55, 166, 1, 149, 246, 5, 163, 22, 110, 23
      ])
    );

  await closeAccount(
    connection,
    master_key,
    keypair_of_token_account_just_created_moments_ago.publicKey,
    master_key.publicKey,
    master_key
  );
})();

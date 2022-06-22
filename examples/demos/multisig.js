import { Keypair, Connection } from "@solana/web3.js";
import { createMultisig } from "@solana/spl-token";

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

  const pub_key1 = Keypair.generate();
  console.log(pub_key1.secretKey);
  const pub_key2 = Keypair.generate();
  console.log(pub_key2.secretKey);
  const pub_key3 = Keypair.generate();
  console.log(pub_key3.secretKey);

  await createMultisig(
    connection,
    master_key,
    [pub_key1.publicKey, pub_key2.publicKey, pub_key3.publicKey],
    2
  );
})();

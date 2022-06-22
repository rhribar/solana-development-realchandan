import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import {
  createAccount,
  getMint,
  getAssociatedTokenAddress,
  transfer
} from "@solana/spl-token";

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

  const mint_addr = await getMint(
    connection,
    new PublicKey("Abcego7AGG4QWbKDRxUnFTNxcjdQp2y5oRXLJjTofuys")
  );

  // freeze, transfer and burn

  const token_account_for_master_key = await getAssociatedTokenAddress(
    mint_addr.address,
    master_key.publicKey
  );

  const receive_tokens = Keypair.generate();

  console.log(receive_tokens.publicKey.toBase58());

  const token_account_for_receive_tokens = await createAccount(
    connection,
    master_key,
    mint_addr.address,
    receive_tokens.publicKey
  );

  await transfer(
    connection,
    master_key,
    token_account_for_master_key,
    token_account_for_receive_tokens,
    master_key.publicKey,
    100 // 1.00
  );
})();

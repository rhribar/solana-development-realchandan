import { Keypair, PublicKey } from "@solana/web3.js";

(async () => {
  const program_address = Keypair.fromSecretKey(
    Uint8Array.from([
      7, 152, 251, 249, 75, 154, 94, 35, 64, 41, 236, 240, 6, 132, 14, 220, 112,
      154, 248, 164, 253, 175, 160, 218, 157, 242, 126, 96, 83, 157, 120, 227,
      76, 164, 201, 213, 68, 127, 84, 197, 114, 226, 249, 132, 156, 52, 191,
      163, 33, 90, 212, 45, 27, 133, 26, 41, 45, 229, 210, 97, 6, 50, 161, 220
    ])
  );
  const seeds = "1234abcd";
  const values = PublicKey.findProgramAddressSync(
    [Buffer.from(seeds)],
    program_address.publicKey
  );

  console.log(`Seeds used - ${seeds} & Address got - ${values[0].toBase58()}`);
})();

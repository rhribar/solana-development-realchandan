import { Connection, PublicKey } from "@solana/web3.js";
import { deserialize } from "borsh";

class Assignable {
  constructor(properties) {
    Object.keys(properties).map((key) => {
      return (this[key] = properties[key]);
    });
  }
}
class Task extends Assignable {}

export async function getBlogPosts() {
  const connection = new Connection("http://localhost:8899");

  const program_accounts = await connection.getProgramAccounts(
    new PublicKey("B1oggzHNyvXVTxqfw64pXogzbAvGFM7DqEbDakyGu25D")
  );

  const schema = new Map([
    [
      Task,
      {
        kind: "struct",
        fields: [
          ["anchor", "u64"],
          ["title", ["u8", 32]],
          ["description", ["u8", 64]],
          ["content", ["u8", 512]]
        ]
      }
    ]
  ]);

  const results = [];

  program_accounts.forEach((item) => {
    const deserialized_data = deserialize(
      schema,
      Task,
      item["account"]["data"]
    );
    const data = {};
    for (var key in deserialized_data) {
      if (key == "anchor") continue;
      data[key] = new TextDecoder("utf-8").decode(
        new Uint8Array(deserialized_data[key].filter((item) => item !== 0))
      );
    }
    results.push(data);
  });
  return results;
}

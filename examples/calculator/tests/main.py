from borsh_construct import CStruct, F64, U64
import requests
import base64

account_pubkey = "AuP4j7tKTypBjkHD8YrE7qwYoERj2xFEED1C6aXAZuJX"

response = requests.post("http://localhost:8899",
                         headers={
                             "Content-Type": "application/json"
                         },
                         json={
                             "jsonrpc": "2.0",
                             "id": 1,
                             "method": "getAccountInfo",
                             "params": [
                                 account_pubkey,
                                 {
                                     "encoding": "base64"
                                 }
                             ]
                         })

base64_string = response.json()["result"]["value"]["data"][0]

structure_of_account = CStruct(
    "anchor" / U64,
    "result" / F64
)

print(structure_of_account.parse(
    base64.decodebytes(base64_string.encode("ascii"))))

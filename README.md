# casper-contracts-js-clients

This project contains a library that will help you create clients for Casper contracts and a few implementations of such clients dedicated to interacting with smart contracts on Casper. 

## Usage examples

```
cp .env.cep47.example .env.cep47
casper-client keygen keys/
npm install
npm run bootstrap
npm run dist
```

In the *.env.cep47* file, replace the following values with your own:

- `WASM_PATH` - Path to the compiled *cep47-token.wasm* file
- `CHAIN_NAME` - Network name, e.g. *casper* for Mainnet or *casper-test* for Testnet
- `NODE_ADDRESS ` - Address of the node's JSON-RPC server. Use port 7777. Example: 195.201.174.222:7777/rpc https://testnet.cspr.live/tools/peers
- `EVENT_STREAM_ADDRESS`: Address of the node's event stream server. Use port 9999 and append  */events/main* to the path. Example: 195.201.174.222:9999/events/main https://testnet.cspr.live/tools/peers
- `MASTER_KEY_PAIR_PATH` - Path to the generated key pair for your signature
- `USER_KEY_PAIR_PATH` - Path to the generated key pair, which in this case would be the same as your `MASTER_KEY_PAIR_PATH` (In certain test scenarios, this could be a different key pair)

### CEP-47 smart contract usage

You must specify all the environment variables in the `.env.cep47` file. If you need help, reference the `.env.cep47.example` file.

**Steps:**

- Set the environment variables in the `.env.cep47` file
- View the [client usage example](e2e/cep47/usage.ts)
- Install the contract:

  ```
  npm run e2e:cep47:install
  ```

- Run the test example:

  ```
  npm run e2e:cep47:usage
  ```

- Mint NFT:
  ```
  npm run e2e:cep47:mint
  ```
 

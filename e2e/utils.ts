import { CasperClient, CLPublicKey, Keys, CasperServiceByJsonRPC } from "casper-js-sdk";
import * as fs from "fs";

export const {
  NODE_ADDRESS,
  EVENT_STREAM_ADDRESS,
  CHAIN_NAME,
  WASM_PATH,
  MASTER_KEY_PAIR_PATH,
  TOKEN_NAME,
  CONTRACT_NAME,
  TOKEN_SYMBOL,
  CONTRACT_HASH,
  INSTALL_PAYMENT_AMOUNT,
  NFT_ID,
  NFT_NAME,
  NFT_DESCRIPTION,
  NFT_ASSET,
  MINT_ONE_PAYMENT_AMOUNT,
  MINT_COPIES_PAYMENT_AMOUNT,
  BURN_ONE_PAYMENT_AMOUNT,
  MINT_ONE_META_SIZE,
  MINT_COPIES_META_SIZE,
  MINT_COPIES_COUNT,
  MINT_MANY_META_SIZE,
  MINT_MANY_META_COUNT,
} = process.env;

export const getBinary = (pathToBinary: string) => {
  return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};

export const parseTokenMeta = (str: string): Array<[string, string]> =>
    str.split(",").map((s) => {
      const map = s.split(" ");
      return [map[0], map[1]];
    });

export const parseNftMetas = (): Map<string, string>[] =>
    [new Map([['name', NFT_NAME!], ['description', NFT_DESCRIPTION!], ['asset', NFT_ASSET!]])]

export const TOKEN_META = new Map(parseTokenMeta(process.env.TOKEN_META!));

export const KEYS = Keys.Ed25519.parseKeyFiles(
    `${MASTER_KEY_PAIR_PATH}/public_key.pem`,
    `${MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Returns a set ECC key pairs - one for each NCTL user account.
 * @param {String} pathToUsers - Path to NCTL user directories.
 * @return {Array} An array of assymmetric keys.
 */
export const getKeyPairOfUserSet = (pathToUsers: string) => {
  return [1, 2, 3, 4, 5].map((userID) => {
    return Keys.Ed25519.parseKeyFiles(
        `${pathToUsers}/user-${userID}/public_key.pem`,
        `${pathToUsers}/user-${userID}/secret_key.pem`
    );
  });
};

export const getDeploy = async (NODE_URL: string, deployHash: string) => {

  const client = new CasperClient(NODE_URL);
  await sleep(5000)
  console.log("...... Casper client created ......")
  let i = 300;
  let counter = 1
  while (i != 0) {
    const [deploy, raw] = await client.getDeploy(deployHash);
    console.log("...... Checking deployment status " + counter + "......")
    counter += 1
    if (raw.execution_results.length !== 0) {
      // @ts-ignore
      if (raw.execution_results[0].result.Success) {
        return deploy;
      } else {
        // @ts-ignore
        throw Error(
            "Contract execution: " +
            // @ts-ignore
            raw.execution_results[0].result.Failure.error_message
        );
      }
    } else {
      i--;
      await sleep(1000);
      continue;
    }
  }
  throw Error("Timeout after " + i + "s. Something's wrong");
};

export const getAccountInfo: any = async (
    nodeAddress: string,
    publicKey: CLPublicKey
) => {
  const client = new CasperServiceByJsonRPC(nodeAddress);
  const stateRootHash = await client.getStateRootHash();
  const accountHash = publicKey.toAccountHashStr();
  const blockState = await client.getBlockState(stateRootHash, accountHash, []);
  return blockState.Account;
};

/**
 * Returns a value under an on-chain account's storage.
 * @param accountInfo - On-chain account's info.
 * @param namedKey - A named key associated with an on-chain account.
 */
export const getAccountNamedKeyValue = (accountInfo: any, namedKey: string) => {
  const found = accountInfo.namedKeys.find((i: any) => i.name === namedKey);
  if (found) {
    return found.key;
  }
  return undefined;
};

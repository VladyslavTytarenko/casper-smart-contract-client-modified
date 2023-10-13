import { config } from "dotenv";
config({ path: ".env.cep47" });
import { CEP47Client } from "casper-cep47-js-client";
import {
  parseTokenMeta,
  getDeploy,
  getAccountInfo,
  getAccountNamedKeyValue,
  MASTER_KEY_PAIR_PATH,
  NODE_ADDRESS,
  CHAIN_NAME,
  WASM_PATH,
  TOKEN_NAME,
  CONTRACT_NAME,
  TOKEN_SYMBOL,
  INSTALL_PAYMENT_AMOUNT
} from "../utils";
import * as fs from "fs";

import { Keys } from "casper-js-sdk";

export const getBinary = (pathToBinary: string) => {
  return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};

const TOKEN_META = new Map(parseTokenMeta(process.env.TOKEN_META!));

const KEYS = Keys.Ed25519.parseKeyFiles(
    `${MASTER_KEY_PAIR_PATH}/public_key.pem`,
    `${MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const install = async () => {
  const cep47 = new CEP47Client(
      NODE_ADDRESS!,
      CHAIN_NAME!
  );

  const installDeployHash = cep47.install(
      getBinary(WASM_PATH!),
      {
        name: TOKEN_NAME!,
        contractName: CONTRACT_NAME!,
        symbol: TOKEN_SYMBOL!,
        meta: TOKEN_META
      },
      INSTALL_PAYMENT_AMOUNT!,
      KEYS.publicKey,
      [KEYS],
  );

  const hash = await installDeployHash.send(NODE_ADDRESS!);

  console.log(`... Contract installation deployHash: ${hash}`);

  await getDeploy(NODE_ADDRESS!, hash);

  console.log(`... Contract installed successfully.`);

  let accountInfo = await getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);

  console.log(`... Account Info: `);
  console.log(JSON.stringify(accountInfo, null, 2));

  const contractHash = await getAccountNamedKeyValue(
      accountInfo,
      `${CONTRACT_NAME!}_contract_hash`
  );

  console.log(`... Contract Hash: ${contractHash}`);
};

install();

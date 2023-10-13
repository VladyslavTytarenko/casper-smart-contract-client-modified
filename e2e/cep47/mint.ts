import { config } from "dotenv";
config({ path: ".env.cep47" });
import { CEP47Client } from "casper-cep47-js-client";
import {
    sleep,
    getDeploy,
    getAccountInfo,
    parseNftMetas,
    getAccountNamedKeyValue,
    MASTER_KEY_PAIR_PATH,
    NODE_ADDRESS,
    CHAIN_NAME,
    CONTRACT_NAME,
    MINT_ONE_PAYMENT_AMOUNT,
    NFT_ID,
    NFT_NAME,
    NFT_DESCRIPTION, NFT_ASSET
} from "../utils";
import * as fs from "fs";

import {
    Keys,
} from "casper-js-sdk";

export const getBinary = (pathToBinary: string) => {
    return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};

const KEYS = Keys.Ed25519.parseKeyFiles(
    `${MASTER_KEY_PAIR_PATH}/public_key.pem`,
    `${MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const mint = async () => {
    console.log(`...... Started NFT minting ...... `);
    const cep47 = new CEP47Client(
        NODE_ADDRESS!,
        CHAIN_NAME!
    );
    let accountInfo = await getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);

    console.log(`... Account Info: `);
    console.log(JSON.stringify(accountInfo, null, 2));

    const contractHash = await getAccountNamedKeyValue(
        accountInfo,
        `${CONTRACT_NAME!}_contract_hash`
    );

    const contractPackageHash = await getAccountNamedKeyValue(
        accountInfo,
        `${CONTRACT_NAME!}_contract_package_hash`
    );

    console.log(`... Contract Hash: ${contractHash}`);
    console.log(`... Contract Package Hash: ${contractPackageHash}`);

    await cep47.setContractHash(contractHash, contractPackageHash);

    await sleep(5 * 1000);

    console.log('\n*************************\n');

    const mintDeploy = await cep47.mint(
        KEYS.publicKey,
        [NFT_ID!],
        parseNftMetas(),
        MINT_ONE_PAYMENT_AMOUNT!,
        KEYS.publicKey,
        [KEYS]
    );

    const mintDeployHash = await mintDeploy.send(NODE_ADDRESS!);

    console.log("...... Mint NFT deploy hash: ", mintDeployHash);

    await getDeploy(NODE_ADDRESS!, mintDeployHash);
    console.log("...... NFT minted successfully ......");
}

mint();

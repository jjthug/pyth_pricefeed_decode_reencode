const { ethers } = require("hardhat");
const pythAbi = require("../abi/pyth.json");
const {HermesClient} = require('@pythnetwork/hermes-client');
const {extractValuesFromUpdatePayload} =require('./decode.js')
const {encodePriceUpdate} =require('./encode.js')

async function main() {
    // Pyth on sepolia
    const PYTH_CONTRACT = "0xDd24F84d36BF92C65F92307595335bdFab5Bbd21";

    const connection = new HermesClient("https://hermes.pyth.network", {});

    const priceIds = [
        "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC
        "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH
        "0x63f341689d98a12ef60a5cff1d7f85c70a9e17bf1575f0e7c0b2512d48b1c8b3", // 1INCH
        "0x2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445", //AAVE
        "0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d", //ADA
        "0xfa17ceaf30d19ba51112fdcc750cc83454776f47fb0112e4af07f15f4bb1ebc0", //ALGO
        "0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7", //AVAX
        "0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f", //BNB
        "0x6147ae2020c6ff95f7c961f79660020f36fa72cea06452a866d5788cbedf61f3", //DASH
        "0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c", //DOGE
        "0x7f5cc8d963fc5b3d2ae41fe5685ada89fd4f14b435f8050f28c7fd409f40c2d8", //ETC
        "0x6b1381ce7e874dc5410b197ac8348162c0dd6c0d4c9cd6322672d6c2b1d58293", //FLOKI
        "0x309d39a65343d45824f63dc6caa75dbf864834f48cfaa6deb122c62239e06474", //GLMR
        "0xf67b033925d73d43ba4401e00308d9b0f26ab4fbd1250e8b5407b9eaade7e1f4", //HONEY
        "0x7a5bc1d2b56ad029048cd63964b3ad2776eadf812edc1a43a31406cb54bff592", //INJ
        "0xa83103141916013b5679001e273281303a6c05f4cebd94da00a785bd74d1e6d8", //IOTX
        "0xb43660a5f790c69354b0729a5ef9d50d68f1df92107540210b9cccba1f947cc2", //JTO
        "0xa6e905d4e85ab66046def2ef0ce66a7ea2a60871e68ae54aed50ec2fd96d8584", //KAVA
        "0xdedebc9e4d916d10b76cfbc21ccaacaf622ab1fc7f7ba586a0de0eba76f12f3f", //KSM
        "0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221", //LINK
    ];

    // select 5 of these tokens
    const selectedTokensIndices=[1,5,9,13,17]

    // price updates
    const res = await connection.getLatestPriceUpdates(priceIds);

    const {header, priceUpdates} = extractValuesFromUpdatePayload(res.binary.data[0])
    const selectedTokens = selectedTokensIndices.map(i => priceUpdates[i]);
    const finalres = encodePriceUpdate(header, selectedTokens)
    

    const priceUpdateHex = '0x' + finalres;
    const calldata = priceUpdateHex;
    const byteValue = ethers.getBytesCopy(priceUpdateHex);
    const updateDataArray = [byteValue];

    const [signer] = await ethers.getSigners();

    const pyth = new ethers.Contract(PYTH_CONTRACT, pythAbi, signer);

    const updateFee = await pyth.getUpdateFee(updateDataArray);
    console.log(`Update fee: ${updateFee.toString()}`);
    
    const feeData = await ethers.provider.getFeeData();
    console.log("feeData:", feeData);

    // update price transaction
    const tx = await pyth.updatePriceFeeds(updateDataArray, {
    value: updateFee, // Some Pyth updates require a fee
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
    });

    const receipt = await tx.wait();
    console.log("receipt:", receipt.hash);
}
main().catch(console.error);

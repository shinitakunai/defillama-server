import { putDexVolumeMetaRecord } from "../../dexVolumes/dexVolumeRecords";
import { DexVolumeMetaRecord } from "../../dexVolumes/dexVolume.types";

// id from protocols/data
export const addDexMetaData = async (
  dexVolumeMetaRecord: DexVolumeMetaRecord | DexVolumeMetaRecord[]
) => {
  if (Array.isArray(dexVolumeMetaRecord)) {
    await Promise.all(
      dexVolumeMetaRecord.map((dexVolMetaInfo) =>
        putDexVolumeMetaRecord(dexVolMetaInfo)
      )
    );
  } else {
    await putDexVolumeMetaRecord(dexVolumeMetaRecord);
  }

  console.log("Successfully added all DEX meta data");
};

// Ex:
// addDexMetaData({
//   id: 1,
//   module: "uniswap",
//   name: "Uniswap",
// });

// addDexMetaData([
//   {
//     id: 119,
//     module: "sushiswap",
//     name: "SushiSwap",
//   },
//   {
//     id: 311,
//     module: "spiritswap",
//     name: "SpiritSwap",
//   },
//   {
//     id: 302,
//     module: "spookyswap",
//     name: "SpookySwap",
//   },
// ]);

import fetch from "node-fetch";
import { DexBreakdownAdapter, DexVolumeAdapter } from "../../dexVolume.types";
import { getAllBreakdownEcosystems } from "../adapters/breakdown";
import { getVolumeEcosystems } from "../adapters/volume";

export const getEcosystemBlocks = (ecosystem: string, timestamp: number) =>
  fetch(`https://coins.llama.fi/block/${ecosystem}/${timestamp}`).then((res) =>
    res.json()
  );

export const getAllEcosystemBlocks = async (
  adapter: DexVolumeAdapter | DexBreakdownAdapter,
  timestamp: number
) => {
  let allEcosystems: string[] = [];
  if ("volume" in adapter) {
    allEcosystems = getVolumeEcosystems(adapter.volume);
  } else if ("breakdown" in adapter) {
    allEcosystems = getAllBreakdownEcosystems(adapter.breakdown);
  }

  const chainBlocks = (
    await Promise.all(
      allEcosystems.map(async (ecosystem) => ({
        ecosystem: await getEcosystemBlocks(ecosystem, timestamp),
      }))
    )
  ).reduce((acc, curr) => ({ ...acc, ...curr }), {});
  return chainBlocks;
};

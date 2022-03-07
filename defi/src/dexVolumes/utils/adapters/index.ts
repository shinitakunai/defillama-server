export * from "./breakdown";
export * from "./volume";

import { DexVolumeMetaRecord } from "../../dexVolume.types";

import dexAdapters from "../../../../DefiLlama-Adapters/dexVolumes";
import { getAllBreakdownEcosystems } from "./breakdown";
import { getVolumeEcosystems } from "./volume";
import { getEcosystemBlocks } from "../blocks";

export const getAllAdapters = (dexVolumeMetas: DexVolumeMetaRecord[]) =>
  dexVolumeMetas.map(({ module }) => dexAdapters[module]);

export const getAllAdapterEcosystems = (
  adapters: ReturnType<typeof getAllAdapters>
) =>
  adapters.reduce((acc: string[], curr) => {
    let ecosystems: string[] = [];
    if ("breakdown" in curr) {
      ecosystems = [...acc, ...getAllBreakdownEcosystems(curr.breakdown)];
    } else if ("volume" in curr) {
      ecosystems = [...acc, ...getVolumeEcosystems(curr.volume)];
    }
    return [...new Set(ecosystems)];
  }, []);

export const getAllAdapterBlocks = (
  ecosystems: string[],
  timestamp: number
) => {
  return Promise.all(
    ecosystems.map((ecosystem) => getEcosystemBlocks(ecosystem, timestamp))
  );
};

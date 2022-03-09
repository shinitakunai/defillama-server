export * from "./breakdown";
export * from "./volume";

import {
  DexAdapter,
  DexVolumeMetaRecord,
  DexAdapterModule,
  ChainBlocks,
} from "../../dexVolume.types";

import dexAdapters from "../../../../DefiLlama-Adapters/dexVolumes";
import {
  calcNumBreakdownFetches,
  getAllBreakdownEcosystems,
} from "./breakdown";
import { calcNumVolumeFetches, getVolumeEcosystems } from "./volume";
import { getEcosystemBlocks } from "../blocks";

export const getAllAdapters = (
  dexVolumeMetas: DexVolumeMetaRecord[]
): DexAdapter[] => dexVolumeMetas.map(({ module }) => dexAdapters[module]);

export const getAllAdapterEntries = (
  dexVolumeMetas: DexVolumeMetaRecord[]
): [DexAdapterModule, DexAdapter][] =>
  dexVolumeMetas.map(({ module }) => [module, dexAdapters[module]]);

export const getAllAdapterDict = (
  dexVolumeMetas: DexVolumeMetaRecord[]
): { [key in DexAdapterModule]: DexAdapter } =>
  Object.fromEntries(
    dexVolumeMetas.map(({ module }) => [module, dexAdapters[module]])
  ) as { [key in DexAdapterModule]: DexAdapter };

export const getAllAdapterEcosystems = (adapters: DexAdapter[]) =>
  adapters.reduce((acc: string[], curr) => {
    let ecosystems: string[] = [];
    if ("breakdown" in curr) {
      ecosystems = [...acc, ...getAllBreakdownEcosystems(curr.breakdown)];
    } else if ("volume" in curr) {
      ecosystems = [...acc, ...getVolumeEcosystems(curr.volume)];
    }
    return [...new Set(ecosystems)];
  }, []);

export const calcAllAdapterNumFetches = (adapters: DexAdapter[]) =>
  adapters.reduce((acc: number, curr) => {
    let total = acc;
    if ("breakdown" in curr) {
      total += calcNumBreakdownFetches(curr.breakdown);
    } else if ("volume" in curr) {
      total += calcNumVolumeFetches(curr.volume);
    }
    return total;
  }, 0);

export const getAllAdapterBlocks = async (
  ecosystems: string[],
  timestamp: number
): Promise<ChainBlocks> => {
  return Object.fromEntries(
    await Promise.all(
      ecosystems.map(async (ecosystem) => [
        ecosystem,
        (await getEcosystemBlocks(ecosystem, timestamp)).height,
      ])
    )
  );
};

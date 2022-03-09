export * from "./breakdown";
export * from "./volume";

import {
  DexAdapter,
  DexVolumeMetaRecord,
  DexAdapterModule,
} from "../../dexVolume.types";

import dexAdapters from "../../../../DefiLlama-Adapters/dexVolumes";
import { getAllBreakdownEcosystems } from "./breakdown";
import { getVolumeEcosystems } from "./volume";
import { getEcosystemBlocks } from "../blocks";

export const getAllAdapters = (
  dexVolumeMetas: DexVolumeMetaRecord[]
): DexAdapter[] => dexVolumeMetas.map(({ module }) => dexAdapters[module]);

export const getAllAdaptersEntries = (
  dexVolumeMetas: DexVolumeMetaRecord[]
): [DexAdapterModule, DexAdapter][] =>
  dexVolumeMetas.map(({ module }) => [module, dexAdapters[module]]);

export const getAllAdaptersDict = (
  dexVolumeMetas: DexVolumeMetaRecord[]
): { [key in DexAdapterModule]: DexAdapter } =>
  Object.fromEntries(
    dexVolumeMetas.map(({ module }) => [module, dexAdapters[module]])
  ) as { [key in DexAdapterModule]: DexAdapter };

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

export const getAllAdapterBlocks = async (
  ecosystems: string[],
  timestamp: number
): Promise<{ height: number; timestamp?: number }> => {
  return Object.fromEntries(
    await Promise.all(
      ecosystems.map(async (ecosystem) => [
        ecosystem,
        await getEcosystemBlocks(ecosystem, timestamp),
      ])
    )
  );
};

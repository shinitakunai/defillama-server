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
  getAllAdapterBreakdownVolumes,
  getAllBreakdownEcosystems,
} from "./breakdown";
import {
  calcNumVolumeFetches,
  getAllAdapterVolumes,
  getVolumeEcosystems,
} from "./volume";
import { getEcosystemBlocks } from "../blocks";
import { getAllCurrTimestamps } from "../../../utils/date";

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

export const getRecordVolumes = async ({
  module,
  adapter,
  timestamp,
  chainBlocks,
  limit = 99,
}: {
  module: string;
  adapter: DexAdapter;
  timestamp: number;
  chainBlocks: ChainBlocks;
  limit?: number;
}) => {
  if ("volume" in adapter) {
    const { volume } = adapter;
    return [
      module,
      await getAllAdapterVolumes({
        volume,
        timestamp,
        chainBlocks,
        limit,
      }),
    ];
  } else {
    const { breakdown } = adapter;
    return [
      module,
      await getAllAdapterBreakdownVolumes({
        breakdown,
        timestamp,
        chainBlocks,
        limit,
      }),
    ];
  }
};

export const getAllRecordVolumes = async (
  dexVolumeMetas: DexVolumeMetaRecord[]
) => {
  const { fetchCurrentHourTimestamp } = getAllCurrTimestamps();
  const allAdapters = getAllAdapters(dexVolumeMetas);
  const numFetches = calcAllAdapterNumFetches(allAdapters);
  const allAdapterEcosystems = getAllAdapterEcosystems(allAdapters);

  const allAdapterEntries = getAllAdapterEntries(dexVolumeMetas);
  const chainBlocks = await getAllAdapterBlocks(
    allAdapterEcosystems,
    fetchCurrentHourTimestamp
  );

  const limit = numFetches > 99 ? Math.floor(numFetches / 10) : numFetches;

  const allVolumes = Object.fromEntries(
    await Promise.all(
      allAdapterEntries.map(
        ([module, adapter]: [DexAdapterModule, DexAdapter]) =>
          getRecordVolumes({
            module,
            adapter,
            timestamp: fetchCurrentHourTimestamp,
            chainBlocks,
            limit,
          })
      )
    )
  );

  return allVolumes;
};

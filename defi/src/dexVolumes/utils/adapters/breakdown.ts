import {
  BreakdownAdapter,
  ChainBlocks,
  DexAdapter,
  FetchResult,
} from "../../dexVolume.types";
import {
  convertVolumeNumericStart,
  getAllAdapterVolumes,
  getVolumeEcosystems,
} from "./volume";

export const isBreakdown = (adapter: DexAdapter) => "breakdown" in adapter;

export const getAllBreakdownEcosystems = (
  breakdown: BreakdownAdapter
): string[] => {
  const uniqueEcosystems = new Set<string>();
  Object.values(breakdown).forEach((volume) => {
    getVolumeEcosystems(volume).forEach((ecosystem) =>
      uniqueEcosystems.add(ecosystem)
    );
  });
  return [...uniqueEcosystems];
};

export const convertBreakdownNumericStart = async (
  breakdown: BreakdownAdapter
): Promise<BreakdownAdapter> =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(breakdown).map(async ([product, adapter]) => {
        const volumeAdapters = await convertVolumeNumericStart(adapter);
        return [product, volumeAdapters];
      })
    )
  );

export const allBreakdownEcosystemStarts = async (
  breakdownWithNumericStart: BreakdownAdapter
) =>
  Object.values(breakdownWithNumericStart).reduce(
    (acc: { [x: string]: number }, curr) => {
      Object.entries(curr).forEach(([ecosystem, { start }]) => {
        acc[ecosystem] = Math.min(
          acc[ecosystem] || Number.MAX_SAFE_INTEGER,
          start
        );
      });
      return acc;
    },
    {}
  );

export const calcNumBreakdownFetches = (breakdown: BreakdownAdapter) =>
  Object.values(breakdown).reduce((acc: number, curr) => {
    return acc + Object.keys(curr).length;
  }, 0);

export const getAllAdapterBreakdownVolumes = async ({
  breakdown,
  timestamp,
  chainBlocks,
  limit = 99,
}: {
  breakdown: BreakdownAdapter;
  timestamp: number;
  chainBlocks: ChainBlocks;
  limit?: number;
}): Promise<{ [x: string]: { [k: string]: FetchResult } }> =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(breakdown).map(async ([protocolName, volume]) => [
        protocolName,
        // limit could theoretically not work here for super edge case of breakdown by a bunch of protocols but will leave for now
        await getAllAdapterVolumes({ timestamp, chainBlocks, volume, limit }),
      ])
    )
  );

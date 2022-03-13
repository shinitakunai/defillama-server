import pThrottle from "../../../utils/pThrottle";
import {
  ChainBlocks,
  DexAdapter,
  Fetch,
  FetchResult,
  VolumeAdapter,
} from "../../dexVolume.types";

export const isVolume = (adapter: DexAdapter) => "volume" in adapter;

export const getVolumeEcosystems = (volume: VolumeAdapter) =>
  Object.keys(volume);

export const convertVolumeNumericStart = async (
  volume: VolumeAdapter
): Promise<VolumeAdapter> =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(volume).map(async ([ecosystem, { start, fetch }]) => {
        return [
          ecosystem,
          {
            start: typeof start === "number" ? start : await start(),
            fetch,
          },
        ];
      })
    )
  );

export const getAllAdapterVolumes = async ({
  volume,
  timestamp,
  chainBlocks,
  limit = 99,
}: {
  volume: VolumeAdapter;
  timestamp: number;
  chainBlocks: ChainBlocks;
  limit?: number;
}): Promise<{ [x: string]: FetchResult }> => {
  const throttle = pThrottle({
    limit: Math.floor(limit),
    interval: 1050,
  });

  return Object.fromEntries(
    await Promise.all(
      Object.entries(volume).map(async ([ecosystem, { fetch }]) => {
        const throttleFetch = throttle(fetch) as Fetch;
        return [ecosystem, await throttleFetch(timestamp, chainBlocks)];
      })
    )
  );
};

export const calcNumVolumeFetches = (volume: VolumeAdapter) =>
  Object.keys(volume).length;

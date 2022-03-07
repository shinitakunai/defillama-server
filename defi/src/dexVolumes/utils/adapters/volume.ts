import { ChainBlocks, DexAdapter, VolumeAdapter } from "../../dexVolume.types";

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
}: {
  volume: VolumeAdapter;
  timestamp: number;
  module: string;
  chainBlocks: ChainBlocks;
}) =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(volume).map(async ([ecosystem, { fetch }]) => [
        ecosystem,
        await fetch(timestamp, chainBlocks),
      ])
    )
  );

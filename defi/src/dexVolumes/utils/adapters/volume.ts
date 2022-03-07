import { VolumeAdapter } from "../../dexVolume.types";

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

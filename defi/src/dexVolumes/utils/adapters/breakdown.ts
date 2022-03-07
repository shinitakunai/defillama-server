import { BreakdownAdapter } from "../../dexVolume.types";
import { convertVolumeNumericStart, getVolumeEcosystems } from "./volume";

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

import {
  BreakdownHourlyEcosystemRecord,
  FetchResult,
  HourlyEcosystemVolumes,
} from "../dexVolume.types";

import BigNumber from "bignumber.js";

export const calcHourlyVolDif = ({
  ecoVols,
  prevRecord,
}: {
  ecoVols: {
    [eco: string]: FetchResult;
  };
  prevRecord: HourlyEcosystemVolumes;
}): { [eco: string]: BigNumber } => {
  const volumeDiffs = Object.entries(ecoVols).map(
    ([ecosystem, { hourlyVolume, dailyVolume, totalVolume }]) => {
      const prevEcoRecord = prevRecord?.[ecosystem];
      let diff = new BigNumber(0);

      if (totalVolume) {
        diff = new BigNumber(totalVolume).minus(
          prevEcoRecord?.totalVolume || 0
        );
      } else if (dailyVolume) {
        diff = new BigNumber(dailyVolume).minus(
          prevEcoRecord?.dailyVolume || 0
        );
      } else if (hourlyVolume) {
        diff = new BigNumber(hourlyVolume).minus(
          prevEcoRecord?.hourlyVolume || 0
        );
      }
      return [ecosystem, diff];
    }
  );

  return Object.fromEntries(volumeDiffs);
};

export const calcAllAdaptHourlyVolDif = ({
  currVolumes,
  prevVolumes,
}: {
  currVolumes: {
    [module: string]: {
      [protocol: string]: {
        [eco: string]: FetchResult;
      };
    };
  };
  prevVolumes: BreakdownHourlyEcosystemRecord;
}) =>
  Object.fromEntries(
    Object.entries(currVolumes).map(([module, breakdown]) => {
      if (breakdown.total) {
        // calc single vol hourly dif
        return [
          module,
          {
            total: calcHourlyVolDif({
              ecoVols: breakdown.total,
              prevRecord: prevVolumes[module].breakdown.total,
            }),
          },
        ];
      } else {
        return [
          module,
          Object.fromEntries(
            Object.entries(breakdown).map(([protocol, ecoVols]) => [
              protocol,
              calcHourlyVolDif({
                ecoVols,
                prevRecord: prevVolumes[module].breakdown[protocol],
              }),
            ])
          ),
        ];
      }
    })
  );

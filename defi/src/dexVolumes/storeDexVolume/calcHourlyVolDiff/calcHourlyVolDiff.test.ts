import BigNumber from "bignumber.js";

import {
  allRecordBreakdownVolumes,
  allPrevRecordBreakdownVolumes,
  allRecordSingleVolumes,
  allPrevRecordSingleVolumes,
} from "../fixture";

import { calcHourlyVolDif } from "./";

describe("calcHourlyVolDif", () => {
  describe("calculates difference in hourly volume given current and previous hourly volumes", () => {
    it("calculate hourly volumes difference correctly for breakdown adapters", async () => {
      const diffRes1 = calcHourlyVolDif({
        ecoVols: allRecordBreakdownVolumes.uniswap.v1,
        prevRecord: allPrevRecordBreakdownVolumes.uniswap.breakdown.v1,
      });

      expect(diffRes1).toEqual({
        ethereum: new BigNumber(0),
      });

      const diffRes3 = calcHourlyVolDif({
        ecoVols: allRecordBreakdownVolumes.uniswap.v3,
        prevRecord: allPrevRecordBreakdownVolumes.uniswap.breakdown.v3,
      });

      expect(diffRes3).toEqual({
        ethereum: new BigNumber(0),
        arbitrum: new BigNumber(0),
        polygon: new BigNumber(0),
      });
    });

    it("calculate hourly volumes difference correctly for single volume adapters", async () => {
      const diffRes1 = calcHourlyVolDif({
        ecoVols: allRecordSingleVolumes.traderjoe.total,
        prevRecord: allPrevRecordSingleVolumes.traderjoe.breakdown.total,
      });

      expect(diffRes1).toEqual({
        avax: new BigNumber(0),
      });
    });
  });
});

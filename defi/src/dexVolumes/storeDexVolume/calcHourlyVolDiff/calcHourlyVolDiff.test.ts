import BigNumber from "bignumber.js";

import {
  allRecordBreakdownVolumes,
  allPrevRecordBreakdownVolumes,
  allRecordSingleVolumes,
  allPrevRecordSingleVolumes,
} from "../fixture";

import { calcHourlyVolDif, calcAllAdaptHourlyVolDif } from "./";

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

describe("calcAllAdaptHourlyVolDif", () => {
  describe("calculates difference in hourly volume given current and previous hourly volumes for all modules", () => {
    it("calculate hourly volumes difference correctly for multiple adapters", async () => {
      const allModulesDiff = calcAllAdaptHourlyVolDif({
        currVolumes: {
          ...allRecordBreakdownVolumes,
          ...allRecordSingleVolumes,
        },
        prevVolumes: {
          ...allPrevRecordBreakdownVolumes,
          ...allPrevRecordSingleVolumes,
        },
      });

      expect(allModulesDiff).toEqual({
        uniswap: {
          v1: {
            ethereum: new BigNumber(0),
          },
          v2: {
            ethereum: new BigNumber(0),
          },
          v3: {
            ethereum: new BigNumber(0),
            arbitrum: new BigNumber(0),
            polygon: new BigNumber(0),
          },
        },
        traderjoe: {
          total: { avax: new BigNumber(0) },
        },
      });
    });
  });
});

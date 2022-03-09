import { Chain } from "@defillama/sdk/build/general";
import dexAdapters from "../../DefiLlama-Adapters/dexVolumes";
import {
  BreakdownAdapter,
  ChainBlocks,
  DexAdapter,
  DexVolumeAdapter,
  DexBreakdownAdapter,
  VolumeAdapter,
} from "../../DefiLlama-Adapters/dexVolumes/dexVolume.type";

export {
  BreakdownAdapter,
  ChainBlocks,
  DexAdapter,
  DexVolumeAdapter,
  DexBreakdownAdapter,
  VolumeAdapter,
};

type DexAdapterModules = typeof dexAdapters;
export type DexAdapterModule = keyof DexAdapterModules;

export type Ecosystem = Chain | "kava" | "terra";

export type Volumes = {
  dailyVolume: string;
  totalVolume: string;
};

export interface HourlyVolumes extends Volumes {
  hourlyVolume: string;
}

export type MonthlyVolumes = {
  monthlyVolume: string;
  totalVolume: string;
};

export type TimestampBlocks = {
  [x: string]: number;
};

export type EcosystemTimestampBlocks = {
  [x: string]: TimestampBlocks;
};

export type TimestampVolumes = {
  [x: string]: {
    totalVolume: string;
  };
};

export type DailyEcosystemVolumes = {
  [x: string]: Volumes;
};

export type HourlyEcosystemVolumes = {
  [x: string]: HourlyVolumes;
};

export type MonthlyEcosystemVolumes = {
  [x: string]: MonthlyVolumes;
};

export type AllEcosystemVolumes = {
  [x: string]: {
    volumes: TimestampVolumes;
    startTimestamp: number;
  };
};

export type FetchResult = {
  block?: number;
  dailyVolume?: string;
  totalVolume: string;
  timestamp: number;
};

export type Fetch = (
  timestamp: number,
  chainBlocks: ChainBlocks
) => Promise<FetchResult>;

export type DailyVolume = string;
export type HourlyVolume = string;
export type TotalVolume = string;
export type Id = number;
export type Unix = number;

export type DailyEcosystemRecord = {
  id: Id;
  unix: Unix;
  dailyVolume: DailyVolume;
  totalVolume: TotalVolume;
  breakdown: {
    [x: string]: DailyEcosystemVolumes;
  };
};

export type HourlyVolumesResult = {
  dailyVolume: DailyVolume;
  hourlyVolume: HourlyVolume;
  totalVolume: TotalVolume;
  ecosystems: HourlyEcosystemVolumes;
};

export type HourlyEcosystemRecord = {
  id: Id;
  unix: Unix;
  dailyVolume: DailyVolume;
  hourlyVolume: HourlyVolume;
  totalVolume: TotalVolume;
  breakdown: {
    [x: string]: HourlyEcosystemVolumes;
  };
};

export type MonthlyEcosystemRecord = {
  id: Id;
  unix: Unix;
  monthlyVolume: HourlyVolume;
  totalVolume: TotalVolume;
  breakdown: {
    [x: string]: MonthlyEcosystemVolumes;
  };
};

export type DexVolumeMetaRecord = {
  id: number;
  module: DexAdapterModule;
  name: string;
  locked?: boolean;
};

export type BreakdownDailyEcosystemRecord = {
  [x: string]: DailyEcosystemRecord;
};

export type BreakdownHourlyEcosystemRecord = {
  [x: string]: HourlyEcosystemRecord;
};

export type BreakdownMonthlyEcosystemRecord = {
  [x: string]: MonthlyEcosystemRecord;
};

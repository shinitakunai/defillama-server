import { getAllCurrTimestamps } from "../../utils/date";
import { DexVolumeMetaRecord } from "../dexVolume.types";
import {
  getAllAdapterEcosystems,
  getAllAdapters,
  getAllPrevRecordVolumes,
  getAllRecordVolumes,
} from "../utils";
import { calcAllAdaptHourlyVolDif } from "./calcHourlyVolDiff";

export const handler = async ({
  dexVolumeMetas,
}: {
  dexVolumeMetas: DexVolumeMetaRecord[];
}) => {
  const {
    fetchCurrentHourTimestamp: timestamp,
    savedHourTimestamp,
    prevSavedHourTimestamp,
    dailyTimestamp,
    startNewDailyVolume,
    monthlyTimestamp,
  } = getAllCurrTimestamps();

  const adapters = getAllAdapters(dexVolumeMetas);

  const ecosystems = getAllAdapterEcosystems(adapters);

  const currVolumes = await getAllRecordVolumes(dexVolumeMetas, timestamp);

  console.log(JSON.stringify(currVolumes), "getAllRecordVolumes");

  const prevVolumes = await getAllPrevRecordVolumes(
    dexVolumeMetas,
    prevSavedHourTimestamp
  );

  console.log(JSON.stringify(prevVolumes), "prevVolumes");

  const volDiffs = calcAllAdaptHourlyVolDif({
    currVolumes,
    prevVolumes,
  });

  console.log(JSON.stringify(volDiffs), "volDiffs");

  // calc difference in volume for each adapter
};

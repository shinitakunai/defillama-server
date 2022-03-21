// import { dexVolumeMetaDb } from "../dexVolumeRecords";
import { getAllCurrTimestamps } from "../../utils/date";
import { handler } from "./rewrite";
import { dexMeta } from "./fixture";

// dexVolumeMetaDb.scan().then((res) => {
//   console.log(res, "meta");
// });

const { fetchCurrentHourTimestamp } = getAllCurrTimestamps();

handler({ dexVolumeMetas: dexMeta.slice(1, 2) });

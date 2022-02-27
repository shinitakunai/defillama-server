import { wrapScheduledLambda } from "./utils/shared/wrap";
import invokeLambda from "./utils/shared/invokeLambda";
import { dexVolumeMetaDb } from "./dexVolumes/dexVolumeRecords";
function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const step = 10;
const handler = async () => {
  // TODO separate those that need to be called on the hour and those using graphs with timestamp

  const dexVolumeMetaRes = await dexVolumeMetaDb.scan();

  const dexVolumes = dexVolumeMetaRes.Items || [];

  const protocolIndexes = Array.from(Array(dexVolumes.length).keys());
  shuffleArray(protocolIndexes);
  for (let i = 0; i < dexVolumes.length; i += step) {
    const event = {
      protocolIndexes: protocolIndexes.slice(i, i + step),
    };

    await invokeLambda(`defillama-prod-storeTvlInterval`, event);
  }
};

export default wrapScheduledLambda(handler);

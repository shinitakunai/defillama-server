import { successResponse, wrap, IResponse } from "./utils/shared";
import protocols, { Protocol } from "./protocols/data";
import { getLastRecord, hourlyTvl } from "./utils/getLastRecord";
import sluggify from "./utils/sluggify";
import {
  getChainDisplayName,
  getDisplayChain,
  nonChains,
  addToChains,
  extraSections,
  transformNewChainName,
} from "./utils/normalizeChain";
import dynamodb, { TableName } from "./utils/shared/dynamodb";
import { craftChainsResponse } from "./getChains";

export function getPercentChange(previous: number, current: number) {
  const change = (current / previous) * 100 - 100;
  if (change == Infinity || Number.isNaN(change)) {
    return null;
  }
  return change;
}

export async function craftProtocolsResponse(useNewChainNames: boolean) {
  const coinMarketsPromises = [];
  for (let i = 0; i < protocols.length; i += 100) {
    coinMarketsPromises.push(
      dynamodb.batchGet(
        protocols
          .slice(i, i + 100)
          .filter((protocol) => typeof protocol.gecko_id === "string")
          .map((protocol) => ({
            PK: `asset#${protocol.gecko_id}`,
            SK: 0,
          }))
      )
    );
  }
  const coinMarkets = Promise.all(coinMarketsPromises).then((results) =>
    results.reduce((p, c) => {
      c.Responses![TableName].forEach((t) => (p[t.PK] = t));
      return p;
    }, {} as any)
  );
  const response = (
    await Promise.all(
      protocols.map(async (protocol) => {
        const lastHourlyRecord = await getLastRecord(hourlyTvl(protocol.id));

        if (lastHourlyRecord === undefined) {
          return null;
        }
        const returnedProtocol: Partial<Protocol> = { ...protocol };
        delete returnedProtocol.module;
        const chainTvls = {} as {
          [chain: string]: number;
        };
        const chains: string[] = [];
        Object.entries(lastHourlyRecord).forEach(([chain, chainTvl]) => {
          if (nonChains.includes(chain)) {
            return;
          }
          const chainDisplayName = getChainDisplayName(chain, useNewChainNames);
          chainTvls[chainDisplayName] = chainTvl;
          addToChains(chains, chainDisplayName);
        });
        if (chains.length === 0) {
          const chain = useNewChainNames ? transformNewChainName(protocol.chain) : protocol.chain;
          if (chainTvls[chain] === undefined) {
            chainTvls[chain] = lastHourlyRecord.tvl;
          }
          extraSections.forEach((section) => {
            const chainSectionName = `${chain}-${section}`;
            if (chainTvls[section] !== undefined && chainTvls[chainSectionName] === undefined) {
              chainTvls[chainSectionName] = chainTvls[section];
            }
          });
          chains.push(getChainDisplayName(chain, useNewChainNames));
        }
        const dataToReturn = {
          ...protocol,
          slug: sluggify(protocol),
          tvl: lastHourlyRecord.tvl,
          chainTvls,
          chains: chains.sort((a, b) => chainTvls[b] - chainTvls[a]),
          chain: getDisplayChain(chains),
          change_1h: getPercentChange(lastHourlyRecord.tvlPrev1Hour, lastHourlyRecord.tvl),
          change_1d: getPercentChange(lastHourlyRecord.tvlPrev1Day, lastHourlyRecord.tvl),
          change_7d: getPercentChange(lastHourlyRecord.tvlPrev1Week, lastHourlyRecord.tvl),
        } as any;
        for (let extraData of ["staking", "pool2"]) {
          if (lastHourlyRecord[extraData] !== undefined) {
            dataToReturn[extraData] = lastHourlyRecord[extraData];
          }
        }
        if (typeof protocol.gecko_id === "string") {
          const coingeckoData = (await coinMarkets)[`asset#${protocol.gecko_id}`];
          if (coingeckoData !== undefined) {
            dataToReturn.fdv = coingeckoData.fdv;
            dataToReturn.mcap = coingeckoData.mcap;
          }
        }
        return dataToReturn;
      })
    )
  )
    .filter((protocol) => protocol !== null)
    .sort((a, b) => b.tvl - a.tvl);
  return response;
}

const handler = async (event: AWSLambda.APIGatewayEvent): Promise<IResponse> => {
  let response = await craftProtocolsResponse(false);
  if (event.queryStringParameters?.includeChains === "true") {
    const chainData = await craftChainsResponse();
    response = [...response, ...chainData];
  }
  return successResponse(response, 10 * 60); // 10 mins cache
};

export default wrap(handler);

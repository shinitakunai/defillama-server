import { DexVolumeMetaRecord } from "../dexVolume.types";

export const dexMeta: DexVolumeMetaRecord[] = [
  { id: 1, module: "uniswap", name: "Uniswap", locked: false },
  { id: 468, module: "traderjoe", name: "Trader Joe", locked: false },
  { id: 302, module: "spookyswap", name: "SpookySwap", locked: true },
  { id: 119, module: "sushiswap", name: "SushiSwap", locked: true },
  { id: 311, module: "spiritswap", name: "SpiritSwap", locked: true },
];

export const allRecordBreakdownVolumes = {
  uniswap: {
    v1: {
      ethereum: {
        timestamp: 1645023600,
        block: 14217819,
        totalVolume: "2127696983.045132809223030004686432",
        dailyVolume: "1258.936928627583252808912047947814",
      },
    },
    v2: {
      ethereum: {
        timestamp: 1645023600,
        block: 14217819,
        totalVolume: "425001521737.0727713786506239574054",
        dailyVolume: "9521618.610485435981394202398457781",
      },
    },
    v3: {
      ethereum: {
        timestamp: 1645023600,
        block: 14217819,
        totalVolume: "422465132206.3081345563570073280239",
        dailyVolume: "71003671.37049335680406347539083853",
      },
      arbitrum: {
        timestamp: 1645023600,
        block: 6182597,
        totalVolume: "7093883640.002166696942385708300042",
        dailyVolume: "1463372.179476419110855768783632116",
      },
      polygon: {
        timestamp: 1645023600,
        block: 25013534,
        totalVolume: "3899273650.370706964775900676410159",
        dailyVolume: "2867960.011274075127023380566026418",
      },
    },
  },
};

export const allPrevRecordBreakdownVolumes = {
  uniswap: {
    breakdown: {
      total: {
        polygon: {
          dailyVolume: "51466046.912344440243402648732183",
          hourlyVolume: "5555727.874206827041264239266439",
          totalVolume: "3899273650.370706964775900676410159",
        },
        ethereum: {
          dailyVolume: "1183694078.070182511294953691362619",
          hourlyVolume: "125551302.658764066845229169217956",
          totalVolume: "849594350926.426038744230661290115732",
        },
        arbitrum: {
          dailyVolume: "13712332.879770611771685736944205",
          hourlyVolume: "2997134.803182877384357474162234",
          totalVolume: "7093883640.002166696942385708300042",
        },
      },
      v1: {
        ethereum: {
          dailyVolume: "36982.128127123201948906842219",
          hourlyVolume: "1654.335698413677270417324556",
          totalVolume: "2127696983.045132809223030004686432",
        },
      },
      v2: {
        ethereum: {
          dailyVolume: "248629996.059196119184557639853",
          hourlyVolume: "22454273.7301498283354272294157",
          totalVolume: "425001521737.0727713786506239574054",
        },
      },
      v3: {
        polygon: {
          dailyVolume: "51466046.912344440243402648732183",
          hourlyVolume: "5555727.874206827041264239266439",
          totalVolume: "3899273650.370706964775900676410159",
        },
        ethereum: {
          dailyVolume: "935027099.8828592689084471446674",
          hourlyVolume: "103095374.5929158248325315224777",
          totalVolume: "422465132206.3081345563570073280239",
        },
        arbitrum: {
          dailyVolume: "13712332.879770611771685736944205",
          hourlyVolume: "2997134.803182877384357474162234",
          totalVolume: "7093883640.002166696942385708300042",
        },
      },
    },
    totalVolume: "860587508216.798912405948947674825933",
    id: 1,
    unix: 1645020000,
    hourlyVolume: "134104165.336153771270850882646629",
    dailyVolume: "1248872457.862297563310042077039007",
  },
};

export const allRecordSingleVolumes = {
  traderjoe: {
    total: {
      avax: {
        timestamp: 1647828000,
        block: 12371301,
        totalVolume: "66241700409.60645079510150980936258",
        dailyVolume: "32773138.87140432438107655042352236",
      },
    },
  },
};

export const allPrevRecordSingleVolumes = {
  traderjoe: {
    breakdown: {
      total: {
        avax: {
          dailyVolume: "9267123.19252500278686359961028",
          hourlyVolume: "4113165.22161239443301348812957",
          totalVolume: "66241700409.60645079510150980936258",
        },
      },
    },
    totalVolume: "66241700409.60645079510150980936258",
    id: 468,
    unix: 1647824400,
    hourlyVolume: "4113165.22161239443301348812957",
    dailyVolume: "9267123.19252500278686359961028",
  },
};

try{
    require('dotenv').config()
}catch(e){}
module.exports = {
    ETHEREUM_RPC: process.env.ETHEREUM_RPC,
    BSC_RPC: process.env.BSC_RPC,
    POLYGON_RPC: process.env.POLYGON_RPC,
    FANTOM_RPC: process.env.FANTOM_RPC,
    ARBITRUM_RPC: process.env.ARBITRUM_RPC,
    OPTIMISM_RPC: process.env.OPTIMISM_RPC,
    XDAI_RPC: process.env.XDAI_RPC,
    HARMONY_RPC: process.env.HARMONY_RPC,
    MOONRIVER_RPC: process.env.MOONRIVER_RPC,
    OUTDATED_WEBHOOK: process.env.OUTDATED_WEBHOOK,
    SPIKE_WEBHOOK: process.env.SPIKE_WEBHOOK,
    CLOUDWATCH_WEBHOOK_URL: process.env.CLOUDWATCH_WEBHOOK_URL,
    DROPS_WEBHOOK: process.env.DROPS_WEBHOOK,
    EULER_MONGODB_APIKEY: process.env.EULER_MONGODB_APIKEY,
}

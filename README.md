# PYTH Price Feeds decoder and reencoder

## Scripts

The decoder script can be found in scripts/decode.js

The encoder script can be found in scripts/encode.js

The transaction script can be found in scripts/pyth_update_sim.js


## Transaction script flow

1. Get Price Updates from the Hermes API
2. Decode the header and individual token price updates using the decoder script
3. Reencode the price updates by merging the header with the required token price updates


## Resources Used:
- Hermes API
- pyth-crosschain library for Pyth contracts

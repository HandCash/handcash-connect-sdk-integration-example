#!/bin/sh
npm run create-bots 50 1
npm run create-bots 50 2
npm run create-bots 50 3
npm run create-bots 50 4
npm run create-bots 50 5
npm run create-bots 50 6

npm run top-up .01 1
npm run top-up .01 2
npm run top-up .01 3
npm run top-up .01 4
npm run top-up .01 5
npm run top-up .01 6

npm run shuffle-utxos 1 1
npm run shuffle-utxos 1 2
npm run shuffle-utxos 1 3
npm run shuffle-utxos 1 4
npm run shuffle-utxos 1 5
npm run shuffle-utxos 1 6
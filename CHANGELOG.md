3.4.0 / 2022-07-21
==================

* Add `excludeCoins` parameter to `createSignedTransaction()`.

3.3.0 / 2022-03-27
==================

* Add `getTransactions` method to the wallet api.
* Add `getTransaction` method to the wallet api.
* Add `getNextAddress` method to the wallet api.
* Add `getLoggedInFingerprint` method to the wallet api.
* Add `pushTx` method to the wallet api.

3.2.0 / 2022-03-18
==================

* Add `coinAnnouncements` parameter to `createSignedTransaction()`.

3.1.2 / 2021-12-15
==================

* Fix best block selection.

3.1.1 / 2021-12-14
==================

* Fix invalid block return value.

3.1.0 / 2021-12-14
==================

* Add support for `excludeReorged` parameter for `getBlocks()`.
* Return the best block for a given height if multiple blocks are returned from the full node.

3.0.0 / 2021-11-05
==================

* Rename plotter service name to `<coin>_plotter`
* Requires chia >= 1.2.11 or forks with the service name change included

2.4.0 / 2021-11-01
==================

* Add full node api method `getAllMempoolTxIds()`

2.3.0 / 2021-11-01
==================

* Add wallet api method `createSignedTransaction()`

2.2.0 / 2021-08-20
==================

* Use the last 24h for avg network space, same as blockchain state

2.1.0 / 2021-07-16
==================

* Add full node api method `getCoinSolution`

2.0.0 / 2021-06-24
==================

* Add support for other coins via `SERVICE(coin)` and `coin` config option for the `Connection`

1.5.0 / 2021-06-24
==================

* Add support for other coins via `setCoin()`

1.4.0 / 2021-06-05
==================

* Add some more wallet and full node api methods: `sendMultiTransaction`, `pushTx`, `getCoinRecordsByPuzzleHash`, `getCoinRecordsByPuzzleHashes`, `getCoinRecordByName`, `getRecentEndOfSubSlot`, `getRecentSignagePoint`

1.3.0 / 2021-05-23
==================

* Add support for logInAndSkip wallet method.

1.2.0 / 2021-05-14
==================

* Add support for closing a connection.

1.1.0 / 2021-05-12
==================

* Add support for subscribing to new signage points.

1.0.1 / 2021-05-06
==================

* Emit initial plotting queue stats as well.

1.0.0 / 2021-04-28
==================

* Initial release.

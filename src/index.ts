import * as yargs from 'yargs';
import { TradeFetcher } from './classes';
import * as exchanges from './exchanges';

const argv = yargs
  .usage('Usage: $0 <command>')
  .command('fetch', 'fetch trade data', cyargs => {
    return cyargs.demandOption(['asset', 'currency', 'exchange']);
  })
  .command('import', 'import trade data', cyargs => {
    return cyargs.demandOption(['start', 'asset', 'currency', 'exchange']);
  })
  .demandCommand().argv;

let exchange = new exchanges.Binance();
switch (argv.exchange) {
  case 'binance':
    exchange = new exchanges.Binance();
    break;

  default:
    console.error(`${argv.exchange} is not setup`);
    process.exit(1);
    break;
}

switch (argv._[0]) {
  case 'fetch':
    const fetcher = new TradeFetcher(exchange, argv.asset, argv.currency);
    fetcher.start();
    break;

  case 'import':
    switch (argv.exchange) {
      case 'binance':
      /*
        const importer = new TradeImporter(
          exchange,
          argv.start,
          argv.asset,
          argv.currency
        );
        importer.start();
        break;
      */
    }
    break;
}

import * as winston from 'winston';
import * as yargs from 'yargs';
import * as exchanges from './exchanges';

const argv = yargs
  .usage('Usage: $0 <command>')
  .command('fetch', 'fetch trade data', cyargs => {
    return cyargs.demandOption(['asset', 'currency', 'exchange']);
  })
  .command('import', 'import trade data', cyargs => {
    return cyargs.demandOption(['start', 'asset', 'currency', 'exchange']);
  })
  .command('market', 'market making', cyargs => {
    return cyargs.demandOption(['asset', 'currency', 'exchange', 'depth']);
  })
  .option('logLevel', {
    default: process.env.NODE_ENV === 'production' ? 'error' : 'info',
  })
  .demandCommand().argv;

winston.default.transports.console.level = argv.logLevel;
// const console = new ();
// winston.add(winston.transports.Console);

switch (argv._[0]) {
  case 'market':
    const marketmaker = new exchanges.BinanceMarketMaker(
      argv.asset,
      argv.currency,
      argv.depth
    );
    marketmaker.init();
    break;

  default:
    winston.error(`${argv._[0]} command not implemented yet`);
    process.exit();
}

/*

let exchange = new exchanges.Binance();
switch (argv.exchange) {
  case 'binance':
    exchange = new exchanges.Binance();
    break;

  default:
    winston.error(`${argv.exchange} is not setup`);
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
        const importer = new TradeImporter(
          exchange,
          argv.start,
          argv.asset,
          argv.currency
        );
        importer.start();
        break;
    }
    break;
}
*/

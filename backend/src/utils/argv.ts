import minimist from 'minimist';

interface Args {
  dev?: boolean;
  noStartOicq?: boolean;
  host?: string;
}

export default minimist(process.argv, {
  boolean: ['dev', 'noStartOicq'],
  string: ['host'],
  alias: { d: 'dev', n: 'noStartOicq', h: 'host' },
}) as Args;

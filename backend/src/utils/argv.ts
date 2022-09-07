import minimist from 'minimist';

interface Args {
  dev?: boolean;
  noStartOicq?: boolean;
}

export default minimist(process.argv, {
  boolean: ['dev', 'noStartOicq'],
  alias: { d: 'dev', n: 'noStartOicq' },
}) as Args;

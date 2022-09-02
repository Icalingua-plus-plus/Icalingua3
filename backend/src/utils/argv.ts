import minimist from 'minimist';

interface Args {
  dev?: boolean;
}

export default {
  ...minimist(process.argv, {
    boolean: ['dev'],
    alias: { d: 'dev' },
  }),
} as Args;

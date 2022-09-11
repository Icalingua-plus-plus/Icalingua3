import { Migration } from '@mikro-orm/migrations';

export class Migration20220911143924 extends Migration {

  async up(): Promise<void> {
    this.addSql('create unique index `message_room_id_seq_rand_time_unique` on `message` (`room_id`, `seq`, `rand`, `time`);');
  }

}

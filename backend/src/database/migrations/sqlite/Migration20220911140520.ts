import { Migration } from '@mikro-orm/migrations';

export class Migration20220911140520 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `message` (`id` integer not null primary key autoincrement, `room_id` text not null, `seq` integer not null, `time` integer not null, `rand` integer not null, `content` blob not null);');
    this.addSql('create index `message_room_id_index` on `message` (`room_id`);');
    this.addSql('create index `message_seq_rand_time_index` on `message` (`seq`, `rand`, `time`);');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20220912083450 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `chat_room` (`room_id` text not null, `name` text not null, `last_message` text null, `last_message_time` integer null, `is_admin` integer null, `is_owner` integer null, `noti_level` integer not null, primary key (`room_id`));');
    this.addSql('create index `chat_room_room_id_index` on `chat_room` (`room_id`);');
    this.addSql('create index `chat_room_last_message_time_index` on `chat_room` (`last_message_time`);');

    this.addSql('create table `message` (`id` integer not null primary key autoincrement, `room_id` text not null, `seq` integer not null, `time` integer not null, `rand` integer not null, `content` blob not null);');
    this.addSql('create index `message_room_id_index` on `message` (`room_id`);');
    this.addSql('create index `message_seq_index` on `message` (`seq`);');
    this.addSql('create index `message_time_index` on `message` (`time`);');
    this.addSql('create index `message_rand_index` on `message` (`rand`);');
    this.addSql('create unique index `message_room_id_seq_rand_time_unique` on `message` (`room_id`, `seq`, `rand`, `time`);');
  }

}

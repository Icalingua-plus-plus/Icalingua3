import { Migration } from '@mikro-orm/migrations';

export class Migration20220920124607 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `authenticator` (`credential_id` blob not null, `credential_public_key` blob not null, `counter` integer not null, `credential_device_type` text not null, `credential_backed_up` integer not null, `transports` text null, primary key (`credential_id`));');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20220921032554 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `authenticator` add column `created_at` datetime not null;');
    this.addSql('alter table `authenticator` add column `last_used_at` datetime not null;');
    this.addSql('alter table `authenticator` add column `aaguid` text not null;');
    this.addSql('alter table `authenticator` add column `attestation_object` blob null default null;');
    this.addSql('create index `authenticator_aaguid_index` on `authenticator` (`aaguid`);');
  }

}

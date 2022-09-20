export default interface IBiliBiliMiniProg {
  app: 'com.tencent.miniapp_01';
  appID?: '100951776';
  bthirdappforward?: true;
  bthirdappforwardforbackendswitch?: true;
  config: {
    autoSize: number;
    ctime: number;
    forward: number;
    height: number;
    token: string;
    type: 'normal';
    width: number;
  };
  desc: '';
  extra: { app_type: 1; appid: 100951776; uin: number };
  meta: {
    detail_1: {
      appType: 0;
      appid: '1109937557';
      desc: string;
      gamePoints: string;
      gamePointsUrl: string;
      host: { nick: string; uin: number };
      icon: string;
      preview: string;
      /** b23.tv 短链接 */
      qqdocurl: string;
      scene: 1036;
      shareTemplateData: {};
      shareTemplateId: string;
      showLittleTail: '';
      title: string;
      url: string;
    };
  };
  prompt: string;
  ver: string;
  view: string;
}

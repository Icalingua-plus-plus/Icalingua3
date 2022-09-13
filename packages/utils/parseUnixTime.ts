import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/** 将 Unix 时间戳转换为人类可读的日期字符串 */
const parseUnixTime = (time: number, isMobile?: boolean) => {
  const date = new Date(time * 1000);
  if (isMobile) return formatDistanceToNow(date, { locale: zhCN, addSuffix: true });
  return format(date, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
};

export default parseUnixTime;

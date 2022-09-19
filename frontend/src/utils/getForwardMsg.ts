/** 获取转发消息的 id */
const getForwardMsg = (xmlStr: string) => {
  const xml = new DOMParser().parseFromString(xmlStr, 'text/xml');
  const resId = xml.querySelector('[m_resid]')?.getAttribute('m_resid');
  if (!resId) return null;
  return {
    resId,
    content: Array.from(xml.querySelectorAll('title')).map((item) => item.innerHTML),
    summary: xml.querySelector('summary')!.textContent!,
    source: xml.querySelector('source')!.getAttribute('name')!,
  };
};

export default getForwardMsg;

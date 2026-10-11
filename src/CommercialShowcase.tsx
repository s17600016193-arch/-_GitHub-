const formats = [
  {
    no: "01",
    title: "品牌故事",
    en: "BRAND STORY",
    description: "从品牌精神出发，把一句主张写成有情绪、有角色、有记忆点的短篇故事。",
    meta: "30—120 SEC · 16:9 / 9:16",
  },
  {
    no: "02",
    title: "产品叙事",
    en: "PRODUCT NARRATIVE",
    description: "让产品进入真实情境，用视觉节奏与人物关系完成自然、有说服力的表达。",
    meta: "15—90 SEC · SOCIAL / CAMPAIGN",
  },
  {
    no: "03",
    title: "社交短片",
    en: "SOCIAL SHORTS",
    description: "为手机屏幕设计开场、节奏与反转，让内容在最短时间里抓住注意力。",
    meta: "6—60 SEC · 9:16 FIRST",
  },
];

export function CommercialShowcase() {
  return (
    <section className="commercial" id="commercial">
      <div className="commercial-heading">
        <p className="section-index">03 / 广告短篇</p>
        <p>BRANDED STORIES<br />&amp; COMMERCIAL SHORTS</p>
      </div>

      <div className="commercial-intro">
        <h2><span>让品牌</span><span>成为故事。</span></h2>
        <div className="commercial-copy">
          <p>把商业目标变成观众愿意看完的内容。我们以漫剧的叙事效率、电影的镜头意识和适配社交平台的节奏，为品牌制作短而完整的视觉故事。</p>
          <a href="mailto:hello@wildfield.studio?subject=%E5%B9%BF%E5%91%8A%E7%9F%AD%E7%AF%87%E5%90%88%E4%BD%9C%E5%92%A8%E8%AF%A2">
            <span>发起广告合作</span><i aria-hidden="true">↗</i>
          </a>
        </div>
      </div>

      <div className="commercial-formats" aria-label="广告短篇服务类型">
        {formats.map((format) => (
          <article key={format.no}>
            <div className="commercial-card-head">
              <span>{format.no}</span>
              <small>{format.en}</small>
            </div>
            <h3>{format.title}</h3>
            <p>{format.description}</p>
            <small className="commercial-meta">{format.meta}</small>
          </article>
        ))}
      </div>

      <div className="commercial-ribbon" aria-hidden="true">
        <span>STRATEGY</span><i>×</i><span>WRITING</span><i>×</i><span>VISUAL</span><i>×</i><span>PRODUCTION</span>
      </div>
    </section>
  );
}

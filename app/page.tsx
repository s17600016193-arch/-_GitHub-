import { HeroCarousel } from "./HeroCarousel";
import { WorkShowcase } from "./WorkShowcase";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="沃野香田首页">
          <span className="brand-cn">沃野香田</span>
          <span className="brand-en">WILD FIELD STUDIO</span>
        </a>
        <nav className="desktop-nav" aria-label="主导航">
          <a href="#work">作品</a>
          <a href="#studio">我们</a>
          <a href="#contact">联系</a>
        </nav>
        <details className="menu">
          <summary aria-label="打开菜单"><span>菜单</span></summary>
          <nav aria-label="移动端导航">
            <a href="#work">作品 <small>WORK</small></a>
            <a href="#studio">我们 <small>STUDIO</small></a>
            <a href="#contact">联系 <small>CONTACT</small></a>
          </nav>
        </details>
      </header>

      <HeroCarousel />

      <section className="manifesto" id="manifesto">
        <p className="section-index">01 / 我们相信</p>
        <div className="manifesto-copy">
          <h2>漫剧不只是<br />会动的漫画。</h2>
          <p>它是镜头、声音、表演与绘画共同发生的下一种叙事。我们从一个角色、一句台词、一种情绪出发，把故事做成观众愿意停留的世界。</p>
        </div>
        <p className="vertical-note">STORIES TAKE ROOT HERE</p>
      </section>

      <section className="works" id="work">
        <div className="section-heading">
          <p className="section-index">02 / 精选作品</p>
          <h2>正在发生</h2>
          <p className="section-aside">ORIGINAL SERIES<br />&amp; VISUAL STORIES</p>
        </div>
        <WorkShowcase />
      </section>

      <section className="studio" id="studio">
        <div className="studio-top">
          <p className="section-index">03 / 沃野香田</p>
          <p className="studio-lead">一家专注原创漫剧与IP内容的<br />叙事创作公司。</p>
        </div>
        <div className="studio-statement">
          <p className="giant-word">生长</p>
          <div className="statement-copy">
            <p>我们聚集编剧、导演、画师、动画师和声音创作者，用稳定的工业流程保护每一个不稳定的灵感。</p>
            <p>从策划开发到制作发行，陪伴一个好故事长出自己的形状。</p>
          </div>
        </div>
        <div className="services" aria-label="服务范围">
          <div><span>01</span><h3>内容开发</h3><p>世界观 / 编剧 / 分镜</p></div>
          <div><span>02</span><h3>漫剧制作</h3><p>美术 / 动画 / 声音</p></div>
          <div><span>03</span><h3>IP运营</h3><p>发行 / 宣推 / 衍生</p></div>
        </div>
      </section>

      <footer id="contact">
        <div className="footer-head">
          <p>一个好故事，<br />从一次交谈开始。</p>
          <a href="mailto:hello@wildfield.studio">和我们聊聊 <span>↗</span></a>
        </div>
        <div className="footer-bottom">
          <div className="footer-brand">沃野香田<small>WILD FIELD STUDIO</small></div>
          <div><p>商务合作</p><a href="mailto:hello@wildfield.studio">hello@wildfield.studio</a></div>
          <div><p>关注我们</p><a href="#top">微信</a><a href="#top">小红书</a><a href="#top">哔哩哔哩</a></div>
          <div className="copyright"><p>© 2026 沃野香田</p><a href="#top">回到顶部 ↑</a></div>
        </div>
      </footer>
    </main>
  );
}

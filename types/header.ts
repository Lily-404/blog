export type HeaderProps = {
  showBackButton?: boolean;
  backButtonHref?: string;
  showNav?: boolean;
  /** 是否显示随笔/归档/关于链接，默认 true；主题切换不受影响 */
  showNavLinks?: boolean;
  isHome?: boolean;
  title?: string;
}
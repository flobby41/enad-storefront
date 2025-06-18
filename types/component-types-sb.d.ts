import {StoryblokStory} from 'storyblok-generate-ts'

export type MultilinkStoryblok =
  | {
      id?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "story";
      target?: "_self" | "_blank";
      [k: string]: any;
    }
  | {
      url?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "asset" | "url";
      target?: "_self" | "_blank";
      [k: string]: any;
    }
  | {
      email?: string;
      linktype?: "email";
      target?: "_self" | "_blank";
      [k: string]: any;
    };

export interface ButtonItemStoryblok {
  title?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  linkFilter?: string;
  variant: "" | "black" | "white" | "white-outline" | "black outline" | "link";
  font?: "" | "brandonGrotesk" | "openSans";
  size?: "" | "default" | "lg" | "sm";
  uppercase: boolean;
  hideOnMarkets?: (number | string)[];
  _uid: string;
  component: "buttonItem";
  [k: string]: any;
}

export interface CategoryStoryblok {
  bodyTop?: (HeroImageStoryblok | ScheduleStoryblok | TextBlockStoryblok)[];
  body?: (HeroImageStoryblok | ScheduleStoryblok | TextBlockStoryblok)[];
  enad_id?: string;
  _uid: string;
  component: "Category";
  [k: string]: any;
}

export interface ContentItemStoryblok {
  content_types?: (
    | ContentTypeBadgeStoryblok
    | ContentTypeButtonsStoryblok
    | ContentTypeRichtextStoryblok
    | ContentTypeTextStoryblok
  )[];
  hidden_mobile: boolean;
  position_desktop?: number | string;
  position_mobile?: number | string;
  text_position_desktop?: "" | "left" | "center" | "right";
  text_position_mobile?: "" | "left" | "center" | "right";
  hidden_desktop: boolean;
  paddingDesktop?: "" | "default" | "small" | "medium" | "large" | "extra_large";
  paddingMobile?: "" | "default" | "medium" | "large";
  offset_y?: string;
  _uid: string;
  component: "contentItem";
  [k: string]: any;
}

export interface ContentTypeBadgeStoryblok {
  title?: string;
  backgroundColor?: number | string;
  textColor?: number | string;
  _uid: string;
  component: "contentTypeBadge";
  [k: string]: any;
}

export interface ContentTypeButtonsStoryblok {
  buttons?: ButtonItemStoryblok[];
  _uid: string;
  component: "contentTypeButtons";
  [k: string]: any;
}

export interface RichtextStoryblok {
  type: string;
  content?: RichtextStoryblok[];
  marks?: RichtextStoryblok[];
  attrs?: any;
  text?: string;
  [k: string]: any;
}

export interface ContentTypeRichtextStoryblok {
  text?: RichtextStoryblok;
  color_desktop?: number | string;
  color_mobile?: number | string;
  uppercase: boolean;
  _uid: string;
  component: "contentTypeRichtext";
  [k: string]: any;
}

export interface ContentTypeTextStoryblok {
  text?: string;
  uppercase: boolean;
  header_type?: number | string;
  font_size_desktop?: number | string;
  font_size_mobile?: number | string;
  font_weight_desktop?: "" | "extraBold" | "bold" | "semiBold" | "medium" | "regular" | "light";
  font_weight_mobile?: "" | "extraBold" | "bold" | "semiBold" | "medium" | "regular" | "light";
  color_desktop?: number | string;
  color_mobile?: number | string;
  letterSpacing?: "" | "normal" | "wide";
  _uid: string;
  component: "contentTypeText";
  [k: string]: any;
}

export interface HeroImageStoryblok {
  paddingBottom?: "" | "big" | "medium" | "small";
  items?: HeroImageItemStoryblok[];
  paddingTop?: "" | "big" | "medium" | "small";
  sizeDesktop?: "" | "1_1" | "3_4" | "4_1" | "4_6" | "5_3" | "9_16" | "16_9";
  sizeMobile?: "" | "1_1" | "3_4" | "4_1" | "4_6" | "5_3" | "9_16" | "16_9";
  _uid: string;
  component: "heroImage";
  [k: string]: any;
}

export interface AssetStoryblok {
  _uid?: string;
  id: number | null;
  alt: string | null;
  name: string;
  focus: string | null;
  source: string | null;
  title: string | null;
  filename: string;
  copyright: string | null;
  fieldtype?: string;
  meta_data?: null | {
    [k: string]: any;
  };
  is_external_url?: boolean;
  [k: string]: any;
}

export interface HeroImageItemStoryblok {
  contentItems?: ContentItemStoryblok[];
  imageDesktop?: AssetStoryblok;
  imageMobile?: AssetStoryblok;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "heroImageItem";
  [k: string]: any;
}

export interface MenuItemStoryblok {
  Text?: string;
  link?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  children?: MenuItemStoryblok[];
  _uid: string;
  component: "menuItem";
  [k: string]: any;
}

export interface PageStoryblok {
  body?: (HeroImageStoryblok | ScheduleStoryblok | TextBlockStoryblok)[];
  _uid: string;
  component: "page";
  uuid?: string;
  [k: string]: any;
}

export interface ScheduleStoryblok {
  internalName?: string;
  start?: string;
  end?: string;
  body?: (HeroImageStoryblok | ScheduleStoryblok | TextBlockStoryblok)[];
  _uid: string;
  component: "schedule";
  [k: string]: any;
}

export interface SettingsStoryblok {
  menuPrimary?: MenuItemStoryblok[];
  menuFooter?: MenuItemStoryblok[];
  sizeTables?: SizeTableItemStoryblok[];
  _uid: string;
  component: "settings";
  [k: string]: any;
}

export interface TableStoryblok {
  thead: {
    _uid: string;
    value?: string;
    component: number;
    [k: string]: any;
  }[];
  tbody: {
    _uid: string;
    body: {
      _uid?: string;
      value?: string;
      component?: number;
      [k: string]: any;
    }[];
    component: number;
    [k: string]: any;
  }[];
  [k: string]: any;
}

export interface SizeTableItemStoryblok {
  title?: string;
  table?: TableStoryblok;
  _uid: string;
  component: "sizeTableItem";
  [k: string]: any;
}

export interface TextBlockStoryblok {
  text?: RichtextStoryblok;
  _uid: string;
  component: "textBlock";
  [k: string]: any;
}

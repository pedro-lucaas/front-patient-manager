export { default as RichText } from './RichText';

export type RichTextProps = {
  richTextContent: RichTextContent;
  setRichTextContent: (content: RichTextContent) => void;
  removeRichTextContent: () => void;
};

export type RichTextContent = {
  title: string;
  content: string;
};
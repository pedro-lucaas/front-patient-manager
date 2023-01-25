export interface IAttribute {
  name: string;
  tag: string;
}

export interface IConfigContext {
  attributes: IAttribute[] | null | undefined;
  createAttribute: (name: string, tag: string) => Promise<void>;
  deleteAttribute: (name: string) => Promise<void>;
}

export interface IConfigProvider {
  children: JSX.Element;
}
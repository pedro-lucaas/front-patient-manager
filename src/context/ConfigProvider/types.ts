export interface IAttribute {
  name: string;
  tag: string;
}

export interface IConfigContext {
  attributes: IAttribute[] | null | undefined;
  inativeDays: number[];
  setInativeDays: React.Dispatch<React.SetStateAction<number[]>>;
  createAttribute: (name: string, tag: string) => Promise<void>;
  deleteAttribute: (name: string) => Promise<void>;
}

export interface IConfigProvider {
  children: JSX.Element;
}
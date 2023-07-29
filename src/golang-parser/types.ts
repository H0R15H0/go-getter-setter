export type Struct = {
  name: string,
  fields: Field[],
};

type Field = {
  name: string,
  type: string,
};
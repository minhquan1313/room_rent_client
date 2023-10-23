export type TGender = "male" | "female" | "unknown";
export interface IGender {
  _id: string;

  title: TGender;
  display_name: string | null;
}

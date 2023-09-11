export class CreateWishDto {
  name: string;
  link: string;
  image: string;
  price: number;
  raised?: number;
  owner?: string;
  description: string;
  copied?: number;
}

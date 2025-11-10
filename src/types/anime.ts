export interface Anime {
  mal_id: number;
  title: string;
  synopsis?: string;
  description?: string;
  images?: {
    jpg?: {
      image_url?: string;
    };
  };
  image_url?: string;
  status?: string;
  episodes?: number | null;
  score?: number | null;
  type?: string;
}

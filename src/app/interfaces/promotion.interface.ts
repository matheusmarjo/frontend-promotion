export interface PromotionI {
  id: string;
  id_category: string;
  image_url: string | null;
  name_button_cta: string;
  rule: string;
  start_date: Date | null;
  end_date: Date | null;
  status: PromotionStatus;
  status_end: PromotionFinishedStatus | null;
  subtitle: string | null;
  title: string;
  url_redirect_cta: string;
  updatedAt: Date;
  createdAt: Date;
  isHighlight: boolean;
  categoria_fk: {
    createdAt: Date;
    id: string;
    name: string;
    updatedAt: Date;
    url_image: string | null;
  }
}

export type PromotionStatus = 'active' | 'inactive' | 'archived';
export type PromotionFinishedStatus = 'inactive' | 'archived';

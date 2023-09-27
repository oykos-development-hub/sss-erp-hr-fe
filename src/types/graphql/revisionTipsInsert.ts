export type revisionTipsInsertItem = {
  id: number;
  revision_id: number;
  user_profile_id: number;
  date_of_accept: string;
  due_date: number;
  recommendation: string;
};

export type revisionTipsInsertResponse = {
  data: {
    revision_tips_Insert: {
      status: string;
      message?: string;
      items: revisionTipsInsertItem;
    };
  };
};

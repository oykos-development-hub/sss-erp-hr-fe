export type revisionPlanInsertItem = {
  name: string;
  year: string;
};

export type revisionPlanInsertResponse = {
  data: {
    revision_plans_Insert: {
      status: string;
      message?: string;
      items: revisionPlanInsertItem;
    };
  };
};

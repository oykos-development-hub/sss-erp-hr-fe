export type RevisionPlanItem = {
  id: number;
  name: string;
  year: string;
  created_at: string;
  updated_at: string;
};

export type RevisionPlanParams = {
  page: number;
  size: number;
};

export type RevisionPlanResponse = {
  data: {
    revision_plans_Overview: {
      message: string;
      status: string;
      items: RevisionPlanItem[];
    };
    revision_plans_Details: {
      message: string;
      status: string;
      items: RevisionPlanItem[];
    };
  };
};

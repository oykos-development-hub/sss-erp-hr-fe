export type revisionInsertItem = {
  id: number;
  title: string;
  plan_id: number;
  serial_number: string;
  date_of_revision: string;
  revision_quartal: string;
  internal_revision_subject_id: number[] | null;
  external_revision_subject_id: number | null;
  revisor_id: number[];
  revision_type_id: number;
};

export type revisionInsertResponse = {
  data: {
    revision_Insert: {
      status: string;
      message?: string;
      items: revisionInsertItem;
    };
  };
};

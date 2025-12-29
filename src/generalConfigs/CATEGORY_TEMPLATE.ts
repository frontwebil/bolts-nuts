export type SpecTemplateItem = {
  group: string;
  key: string;
  type?: "text" | "select";
  options?: string[];
  placeholder?: string;
  required?: boolean;
};

export type CategoryTemplate = {
  id: string;
  title: string;
  specs: SpecTemplateItem[];
};

export const CATEGORY_TEMPLATES: CategoryTemplate[] = [
  {
    id: "bolts-screws",
    title: "Bolts / Screws",
    specs: [
      {
        group: "Dimensions",
        key: "Length",
        type: "text",
        placeholder: '50 mm or 2"',
        required: true,
      },
      {
        group: "Dimensions",
        key: "Diameter",
        type: "text",
        placeholder: '4 mm or 1/4"',
        required: true,
      },

      {
        group: "Head / Drive",
        key: "Drive Type",
        type: "select",
        options: ["Torx", "Phillips (+)", "Slotted (-)"],
        required: true,
      },
      {
        group: "Head / Drive",
        key: "Head Type",
        type: "select",
        options: ["Flat Head", "Pan Head", "Hex Head"],
        required: true,
      },

      {
        group: "Application",
        key: "Type",
        type: "select",
        options: ["Wood", "Metal", "Concrete"],
        required: true,
      },
    ],
  },

  {
    id: "anchors",
    title: "Anchors",
    specs: [
      {
        group: "Dimensions",
        key: "Length",
        type: "text",
        placeholder: '60 mm or 2-1/2"',
        required: true,
      },
      {
        group: "Dimensions",
        key: "Diameter",
        type: "text",
        placeholder: '8 mm or 3/8"',
        required: true,
      },

      {
        group: "Application",
        key: "Type",
        type: "select",
        options: ["Drywall", "Concrete", "Wood"],
        required: true,
      },
    ],
  },
];

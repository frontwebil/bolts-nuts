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
  labelOptions: string;
  optionsLinksLabel: string;
  specKey: string;
  specs: SpecTemplateItem[];
};

export const CATEGORY_TEMPLATES: CategoryTemplate[] = [
  {
    id: "bolts-screws",
    title: "Bolts / Screws",
    labelOptions: "Pieces per package",
    optionsLinksLabel: "Product Length",
    specKey: "Length",
    specs: [
      {
        group: "Dimensions",
        key: "Length",
        type: "text",
        placeholder: "50 mm or 2 in",
        required: true,
      },
      {
        group: "Dimensions",
        key: "Diameter",
        type: "text",
        placeholder: "4 mm or 1/4 in",
        required: true,
      },

      {
        group: "Head / Drive",
        key: "Drive Type",
        type: "select",
        options: ["Torx", "Phillips (+)", "Slotted (-)", "Square", "Hex"],
        required: true,
      },
      {
        group: "Head / Drive",
        key: "Head Type",
        type: "select",
        options: ["Flat Head", "Pan Head", "Hex Head", "Hexagon"],
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
    labelOptions: "Pieces per package",
    optionsLinksLabel: "Product Length",
    specKey: "Length",
    specs: [
      {
        group: "Dimensions",
        key: "Length",
        type: "text",
        placeholder: "60 mm or 2-1/2 in",
        required: true,
      },
      {
        group: "Dimensions",
        key: "Diameter",
        type: "text",
        placeholder: "8 mm or 3/8 in",
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

  {
    id: "bits",
    title: "Bits",
    labelOptions: "Pieces per package",
    optionsLinksLabel: "Product Length",
    specKey: "Length",
    specs: [
      {
        group: "Dimensions",
        key: "Length",
        type: "text",
        placeholder: "25 mm or 1 in",
        required: true,
      },
      {
        group: "Dimensions",
        key: "Size",
        type: "text",
        placeholder: "#1",
        required: true,
      },
      {
        group: "Type",
        key: "Drive Type",
        type: "select",
        options: ["Phillips (+)", "Slotted (-)", "Torx", "Square", "Hex"],
        required: true,
      },
      {
        group: "Type",
        key: "Shank  Type",
        type: "select",
        options: [
          "SDS-Plus",
          "SDS-Max",
          "Straight Shank",
          "Hex Shank",
          "SDS-Quick",
          "SDS-Top",
          "Spline",
        ],
        required: true,
      },
    ],
  },

  {
    id: "drills",
    title: "Drills",
    labelOptions: "Pieces per package",
    optionsLinksLabel: "Product Length",
    specKey: "Length",
    specs: [
      {
        group: "Dimensions",
        key: "Length",
        type: "text",
        placeholder: "100 mm or 4 in",
        required: true,
      },
      {
        group: "Dimensions",
        key: "Diameter",
        type: "text",
        placeholder: "M2 / M3 / M4 or 1/4 / 3/8 / 1/2",
        required: true,
      },
      {
        group: "Application",
        key: "Type",
        type: "select",
        options: ["Metal", "Wood", "Concrete"],
        required: true,
      },
      {
        group: "Type",
        key: "Shank  Type",
        type: "select",
        options: ["Strength  Shank", "Hex Shank", "SDS-Shank"],
        required: true,
      },
    ],
  },

  {
    id: "washers",
    title: "Washers",
    labelOptions: "Pieces per package",
    optionsLinksLabel: "Inner Diameter",
    specKey: "Inner Diameter",
    specs: [
      {
        group: "Dimensions",
        key: "Inner Diameter",
        type: "text",
        placeholder: "M6 or 1/4 in",
        required: true,
      },
      {
        group: "Dimensions",
        key: "Outer Diameter",
        type: "text",
        placeholder: "18 mm or 3/4 in",
        required: true,
      },
      {
        group: "Dimensions",
        key: "Thickness",
        type: "text",
        placeholder: "1.5 mm or 1/16 in",
        required: true,
      },
      {
        group: "Type",
        key: "Material",
        type: "text",
        placeholder: "Metal",
        required: true,
      },
    ],
  },
];

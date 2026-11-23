import type {
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";

type ExprienceRole = "Market" | "Finance" | "Development";

export interface Exprience {
  id: number;
  name: string;
  age: number;
  joinDate: string;
  role: ExprienceRole;
  isFullTime: boolean;
}

const INITIAL_ExprienceS_STORE: Exprience[] = [
  {
    id: 1,
    name: "Edward Perry",
    age: 25,
    joinDate: "2025-07-16T00:00:00.000Z",
    role: "Finance",
    isFullTime: true,
  },
  {
    id: 2,
    name: "Josephine Drake",
    age: 36,
    joinDate: "2025-07-16T00:00:00.000Z",
    role: "Market",
    isFullTime: false,
  },
  {
    id: 3,
    name: "Cody Phillips",
    age: 19,
    joinDate: "2025-07-16T00:00:00.000Z",
    role: "Development",
    isFullTime: true,
  },
];

export function getExpriencesStore(): Exprience[] {
  const stringifiedExpriences = localStorage.getItem("expriences-store");
  return stringifiedExpriences
    ? JSON.parse(stringifiedExpriences)
    : INITIAL_ExprienceS_STORE;
}

export function setExpriencesStore(Expriences: Exprience[]) {
  return localStorage.setItem("expriences-store", JSON.stringify(Expriences));
}

export async function getMany({
  paginationModel,
  filterModel,
  sortModel,
}: {
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
}): Promise<{ items: Exprience[]; itemCount: number }> {
  const ExpriencesStore = getExpriencesStore();

  let filteredExpriences = [...ExpriencesStore];

  // Apply filters (example only)
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) {
        return;
      }

      filteredExpriences = filteredExpriences.filter((Exprience) => {
        const ExprienceValue = Exprience[field as keyof Exprience];

        switch (operator) {
          case "contains":
            return String(ExprienceValue)
              .toLowerCase()
              .includes(String(value).toLowerCase());
          case "equals":
            return ExprienceValue === value;
          case "startsWith":
            return String(ExprienceValue)
              .toLowerCase()
              .startsWith(String(value).toLowerCase());
          case "endsWith":
            return String(ExprienceValue)
              .toLowerCase()
              .endsWith(String(value).toLowerCase());
          case ">":
            return ExprienceValue > value;
          case "<":
            return ExprienceValue < value;
          default:
            return true;
        }
      });
    });
  }

  // Apply sorting
  if (sortModel?.length) {
    filteredExpriences.sort((a, b) => {
      for (const { field, sort } of sortModel) {
        if (a[field as keyof Exprience] < b[field as keyof Exprience]) {
          return sort === "asc" ? -1 : 1;
        }
        if (a[field as keyof Exprience] > b[field as keyof Exprience]) {
          return sort === "asc" ? 1 : -1;
        }
      }
      return 0;
    });
  }

  // Apply pagination
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize;
  const paginatedExpriences = filteredExpriences.slice(start, end);

  return {
    items: paginatedExpriences,
    itemCount: filteredExpriences.length,
  };
}

export async function getOne(ExprienceId: number) {
  const ExpriencesStore = getExpriencesStore();

  const ExprienceToShow = ExpriencesStore.find(
    (Exprience) => Exprience.id === ExprienceId,
  );

  if (!ExprienceToShow) {
    throw new Error("Exprience not found");
  }
  return ExprienceToShow;
}

export async function createOne(data: Omit<Exprience, "id">) {
  const ExpriencesStore = getExpriencesStore();

  const newExprience = {
    id:
      ExpriencesStore.reduce(
        (max, Exprience) => Math.max(max, Exprience.id),
        0,
      ) + 1,
    ...data,
  };

  setExpriencesStore([...ExpriencesStore, newExprience]);

  return newExprience;
}

export async function updateOne(
  ExprienceId: number,
  data: Partial<Omit<Exprience, "id">>,
) {
  const ExpriencesStore = getExpriencesStore();

  let updatedExprience: Exprience | null = null;

  setExpriencesStore(
    ExpriencesStore.map((Exprience) => {
      if (Exprience.id === ExprienceId) {
        updatedExprience = { ...Exprience, ...data };
        return updatedExprience;
      }
      return Exprience;
    }),
  );

  if (!updatedExprience) {
    throw new Error("Exprience not found");
  }
  return updatedExprience;
}

export async function deleteOne(ExprienceId: number) {
  const ExpriencesStore = getExpriencesStore();

  setExpriencesStore(
    ExpriencesStore.filter((Exprience) => Exprience.id !== ExprienceId),
  );
}

// Validation follows the [Standard Schema](https://standardschema.dev/).

type ValidationResult = {
  issues: { message: string; path: (keyof Exprience)[] }[];
};

export function validate(Exprience: Partial<Exprience>): ValidationResult {
  let issues: ValidationResult["issues"] = [];

  if (!Exprience.name) {
    issues = [...issues, { message: "Name is required", path: ["name"] }];
  }

  if (!Exprience.age) {
    issues = [...issues, { message: "Age is required", path: ["age"] }];
  } else if (Exprience.age < 18) {
    issues = [...issues, { message: "Age must be at least 18", path: ["age"] }];
  }

  if (!Exprience.joinDate) {
    issues = [
      ...issues,
      { message: "Join date is required", path: ["joinDate"] },
    ];
  }

  if (!Exprience.role) {
    issues = [...issues, { message: "Role is required", path: ["role"] }];
  } else if (!["Market", "Finance", "Development"].includes(Exprience.role)) {
    issues = [
      ...issues,
      {
        message: 'Role must be "Market", "Finance" or "Development"',
        path: ["role"],
      },
    ];
  }

  return { issues };
}

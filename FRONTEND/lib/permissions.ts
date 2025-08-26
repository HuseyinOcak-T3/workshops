export type CrudFlag = "can_view" | "can_create" | "can_update" | "can_archive";
export type ResourcePerms = Partial<Record<CrudFlag, boolean>>;
export type AllPerms = {
  tasks?: ResourcePerms;
  [k: string]: ResourcePerms | undefined;
};

const KEY = "perms";

export function setPerms(perms: AllPerms | null) {
  if (typeof window === "undefined") return;
  try {
    if (perms) localStorage.setItem(KEY, JSON.stringify(perms));
    else localStorage.removeItem(KEY);
  } catch {/* no-op */}
}

export function getPerms(): AllPerms {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AllPerms) : {};
  } catch {
    return {};
  }
}

function toBool(v: any): boolean | undefined {
  if (v === true || v === false) return v;
  if (v === 1 || v === "1" || v === "true") return true;
  if (v === 0 || v === "0" || v === "false") return false;
  return undefined;
}

export function normalizeAnyPerms(anyPerms: any): AllPerms | null {
  if (!anyPerms || typeof anyPerms !== "object") return null;
  const src =
    anyPerms.tasks ||
    anyPerms.Tasks ||
    anyPerms.task ||
    anyPerms.task_permissions ||
    {};

  const t: ResourcePerms = {
    can_view:   toBool(src.can_view ?? src.view ?? src.read),
    can_create: toBool(src.can_create ?? src.create),
    can_update: toBool(src.can_update ?? src.update),
    can_archive:toBool(src.can_archive ?? src.archive ?? src.delete),
  };

  const filtered = Object.fromEntries(
    Object.entries(t).filter(([, v]) => typeof v === "boolean")
  ) as ResourcePerms;

  return Object.keys(filtered).length ? { tasks: filtered } : null;
}

export function derivePermsFromRole(role: any, level?: number): AllPerms {
  const code = (typeof role === "string"
    ? role
    : role?.code || role?.name || localStorage.getItem("userRole") || ""
  ).toString().toLowerCase();

  const lvl = typeof level === "number"
    ? level
    : Number(localStorage.getItem("permissionLevel"));

  const isAdmin = code.includes("admin") || code.includes("super") || (lvl && lvl <= 2);
  if (isAdmin) {
    return { tasks: { can_view: true, can_create: true, can_update: true, can_archive: true } };
  }

  if (code === "workshop_responsible" || lvl === 5) {
    return { tasks: { can_view: true, can_create: true, can_update: false, can_archive: false } };
  }

  return {};
}

export function hasPerm<R extends keyof AllPerms>(resource: R, flag: CrudFlag): boolean {
  const saved = getPerms() as any;
  const direct = saved?.[resource]?.[flag];
  if (typeof direct === "boolean") return direct;

  const role = localStorage.getItem("userRole");
  const level = Number(localStorage.getItem("permissionLevel"));
  const derived = derivePermsFromRole(role, Number.isNaN(level) ? undefined : level) as any;
  return Boolean(derived?.[resource]?.[flag]);
}

export const taskPerms = {
  canView:   () => hasPerm("tasks", "can_view"),
  canCreate: () => hasPerm("tasks", "can_create"),
  canUpdate: () => hasPerm("tasks", "can_update"),
  canArchive:() => hasPerm("tasks", "can_archive"),
};

export function normalizeAndSetPerms(anyPerms: any, role?: any, level?: number) {
  const normalized = normalizeAnyPerms(anyPerms);
  setPerms(normalized ?? derivePermsFromRole(role, level));
}
import custom_axios from "@/lib/customAxios";
import { ApiConstants } from "@/lib/ApiConstants";

export type Task = {
  id: number;
  title: string;
  description?: string;
  status?: string;
  priority?: number | string;
  due_date?: string;
  ateliers: number[];
  commission: number | null;
  commission_name?: string;
  created_by_full_name?: string;
  created_at?: string;
  updated_at?: string;
  active?: boolean;

  last_completed_by_name?: string;  
  last_completed_at?: string;       
  completed_by_full_name?: string;
  completed_at?: string;
};

export async function getTasks(params?: Record<string, any>) {
  const { data } = await custom_axios.get(ApiConstants.TASKS.LIST, { params });
  return Array.isArray(data) ? data : data.results;
}

export async function completeTask(id: number) {
  const { data } = await custom_axios.post<Task>(ApiConstants.TASKS.COMPLETE(id));
  return data;
}

export async function getTask(id: number) {
  const { data } = await custom_axios.get(ApiConstants.TASKS.DETAIL(id));
  return data as Task;
}

export async function createTask(payload: Partial<Task>) {
  const pr = payload.priority;
  const prNum =
    pr === "high" ? 3 : pr === "medium" ? 2 : pr === "low" ? 1 :
    typeof pr === "number" ? pr : undefined;

  const { data } = await custom_axios.post(ApiConstants.TASKS.CREATE, { ...payload, priority: prNum });
  return data as Task;
}

export async function updateTask(id: number, payload: Partial<Task>) {
  const pr = payload.priority;
  const prNum =
    pr === "high" ? 3 : pr === "medium" ? 2 : pr === "low" ? 1 :
    typeof pr === "number" ? pr : undefined;

  const { data } = await custom_axios.patch(ApiConstants.TASKS.UPDATE(id), { ...payload, priority: prNum });
  return data as Task;
}

export async function archiveTask(id: number) {
  await custom_axios.delete(ApiConstants.TASKS.ARCHIVE(id));
}
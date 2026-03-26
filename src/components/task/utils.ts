import type { ChecklistItem } from "@/types/task.types";
import { STATUS_CRITICAL_RANKING } from "@/utils/constants";

export function updateTaskStatus(checkList: ChecklistItem[]) {
  let taskStatus = STATUS_CRITICAL_RANKING.length - 1;
  checkList.forEach(({ status }) => {
    const rankingValueIndex = STATUS_CRITICAL_RANKING.indexOf(status);
    if (rankingValueIndex >= taskStatus) return;

    taskStatus = rankingValueIndex;
  });

  return STATUS_CRITICAL_RANKING[taskStatus];
}
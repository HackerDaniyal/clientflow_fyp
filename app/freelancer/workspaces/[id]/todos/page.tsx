import { listTodos } from "@/app/actions/todos";
import { TodoList } from "@/components/workspace/TodoList";

export default async function FreelancerTodosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const todos = await listTodos(id);
  return <TodoList workspaceId={id} initial={todos} />;
}

import { useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const initialTodos = [
  { id: 1, text: 'Walk the dog', completed: false },
  { id: 2, text: 'Finish homework', completed: true },
  { id: 3, text: 'Buy groceries', completed: false },
]

export default function App() {
  const [todos, setTodos] = useState(initialTodos)
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [isLoading] = useState(false)

  const remainingCount = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length
  }, [todos])

  function addTodo() {
    const trimmed = newTodo.trim()

    if (!trimmed) return

    const todoToAdd = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    }

    setTodos((currentTodos) => [...currentTodos, todoToAdd])
    setNewTodo('')
  }

  function handleNewTodoKeyDown(event) {
    if (event.key === 'Enter') {
      addTodo()
    }
  }

  function deleteTodo(id) {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== id)
    )
  }

  function toggleCompleted(id) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  function startEditing(todo) {
    setEditingId(todo.id)
    setEditingText(todo.text)
  }

  function saveEdit(id) {
    const trimmed = editingText.trim()

    if (!trimmed) return

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      )
    )

    setEditingId(null)
    setEditingText('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingText('')
  }

  function handleEditKeyDown(event, id) {
    if (event.key === 'Enter') {
      saveEdit(id)
    }

    if (event.key === 'Escape') {
      cancelEdit()
    }
  }

  function clearCompletedTodos() {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => !todo.completed)
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-2 text-4xl font-bold text-amaranth text-center">Todo App</h1>
        <p className="mb-6 text-sm text-slate-600 text-center">
          {remainingCount} todo{remainingCount !== 1 ? 's' : ''} left to complete
        </p>

        <div className="mb-6 flex gap-3">
          <input
            type="text"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            onKeyDown={handleNewTodoKeyDown}
            placeholder="Add a new todo"
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-slate-500"
          />
          <button
            onClick={addTodo}
            className="rounded-xl bg-midnight px-5 py-3 font-medium text-white transition hover:opacity-90"
          >
            Add
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton height={56} borderRadius={16} />
            <Skeleton height={56} borderRadius={16} />
            <Skeleton height={56} borderRadius={16} />
          </div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-1 items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompleted(todo.id)}
                    className="h-5 w-5"
                  />

                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(event) => setEditingText(event.target.value)}
                      onKeyDown={(event) => handleEditKeyDown(event, todo.id)}
                      autoFocus
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                    />
                  ) : (
                    <span
                      className={`flex-1 text-base ${
                        todo.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {editingId === todo.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="rounded-xl bg-brook px-4 py-2 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded-xl bg-slate-300 px-4 py-2 text-slate-900"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(todo)}
                        className="rounded-xl w-18 bg-chalk px-4 py-2 text-amaranth"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="rounded-xl bg-amaranth px-4 py-2 text-white"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={clearCompletedTodos}
            className="rounded-xl bg-midnight px-4 py-3 text-white"
          >
            Clear completed todos
          </button>
        </div>
      </div>
    </main>
  )
}
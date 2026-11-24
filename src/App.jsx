import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, editTask, removeTask } from "./redux/slices/TodosSlices.js";

export default function App() {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.todos.data);
    

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskName, setTaskName] = useState([]);
    const [taskTime, setTaskTime] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const openAddModal = () => {
        setSelectedTask(null);
        setTaskName("");
        setTaskTime("");
        setIsModalOpen(true);
    };

    const openEditModal = task => {
        setSelectedTask(task);
        setTaskName(task.title);
        setTaskTime(task.time);
        setIsModalOpen(true);
    };

    const formatTime = time => {
        if (!time) return "";
        if (time.includes("AM") || time.includes("PM")) return time;

        const [hour, minute] = time.split(":");
        const date = new Date();
        date.setHours(Number(hour), Number(minute));

        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (!taskName.trim()) return;

        if (selectedTask) {
            dispatch(
                editTask({
                    id: selectedTask.id,
                    title: taskName,
                    time: taskTime,
                })
            );
        } else {
            dispatch(
                addTask({
                    id: Date.now(),
                    title: taskName,
                    time: taskTime,
                    done: false,
                })
            );
        }

        setIsModalOpen(false);
        setTaskName("");
        setTaskTime("");
        setSelectedTask(null);
    };

    const toggleTask = task => {
        dispatch(editTask({ id: task.id, done: !task.done }));
    };

    return (
        <main className="min-h-screen bg-zinc-300 flex justify-center px-4">
            <div className="bg-white w-full max-w-3xl my-5 p-6 md:p-10 rounded-lg">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">My Everyday</h1>
                    <span className="text-zinc-400">•••</span>
                </div>

                <div className="flex justify-between items-center mt-5 text-zinc-500">
                    <p>{today}</p>
                    <p>All Tasks</p>
                </div>

                <div className="mt-6">
                    {tasks.length === 0 ? (
                        <p className="text-zinc-500">Belum ada tugas.</p>
                    ) : (
                        <ul className="divide-y divide-zinc-200">
                            {tasks.map(task => (
                                <li key={task.id} className="flex items-center justify-between gap-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={task.done}
                                            onChange={() => toggleTask(task)}
                                            aria-label={`Tandai ${task.title} selesai`}
                                        />
                                        <div>
                                            <p className={task.done ? "line-through text-zinc-400" : "font-medium"}>
                                                {task.title}
                                            </p>
                                            <p className="text-sm text-zinc-500">{formatTime(task.time)}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 text-sm">
                                        <button type="button" onClick={() => openEditModal(task)} className="text-blue-600">
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => dispatch(removeTask(task.id))}
                                            className="text-red-600"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    type="button"
                    onClick={openAddModal}
                    className="mt-6 rounded bg-zinc-900 px-4 py-2 text-white"
                >
                    + Add Task
                </button>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-lg bg-white p-6"
                        onClick={event => event.stopPropagation()}
                    >
                        <h2 className="mb-5 text-xl font-semibold">
                            {selectedTask ? "Edit Task" : "Add Task"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="taskName" className="mb-1 block">Task Name</label>
                                <input
                                    id="taskName"
                                    type="text"
                                    placeholder="Masukkan nama tugas"
                                    value={taskName}
                                    onChange={event => setTaskName(event.target.value)}
                                    className="w-full rounded border border-zinc-300 p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="taskTime" className="mb-1 block">Time</label>
                                <input
                                    id="taskTime"
                                    type="time"
                                    value={taskTime}
                                    onChange={event => setTaskTime(event.target.value)}
                                    className="w-full rounded border border-zinc-300 p-2"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded border border-zinc-300 px-4 py-2"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white">
                                    {selectedTask ? "Save Changes" : "Add Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

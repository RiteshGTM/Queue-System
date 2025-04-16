import { useState, useEffect } from "react";

const Queue = () => {
  const [queue, setQueue] = useState([]);
  const [name, setName] = useState("");
  const [lastRemoved, setLastRemoved] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load queue and theme from localStorage on page load
  useEffect(() => {
    const savedQueue = JSON.parse(localStorage.getItem("queue")) || [];
    setQueue(savedQueue);

    const savedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedTheme);
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("queue", JSON.stringify(queue));
  }, [queue]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Add name to queue
  const addToQueue = () => {
    if (name.trim() && queue.length < 10) {
      setQueue([...queue, name]);
      setName("");
    }
  };

  // Remove first name from queue and allow undo
  const removeFromQueue = () => {
    if (queue.length > 0) {
      const updatedQueue = [...queue]; // Create a copy of the queue
      setLastRemoved(updatedQueue.shift()); // Remove only the first name
      setQueue(updatedQueue);

      // Set a timeout for undo (4 seconds)
      setTimeout(() => {
        setLastRemoved(null);
      }, 4000);
    } else {
      alert("Queue is empty! Nothing to remove.");
    }
  };

  // Undo last removed item
  const undoLastRemoval = () => {
    if (lastRemoved) {
      setQueue([lastRemoved, ...queue]);
      setLastRemoved(null);
    }
  };

  // Handle key presses (Enter for adding, Alt + R for removing)
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        addToQueue();
      }
      if (event.altKey && event.key.toLowerCase() === "r") {
        event.preventDefault(); // Prevent browser refresh
        removeFromQueue();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [queue, name]);

  return (
    <div className={`max-w-lg mx-auto p-6 rounded-xl mt-10 transition duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white shadow-lg"} relative text-center`}>
      
      {/* Dark Mode Toggle Button (Top Right Corner) */}
      <button
        className="absolute top-2 right-2 px-3 py-2 rounded text-white bg-gray-700 hover:bg-gray-600"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <h1 className="text-2xl font-bold mb-4">Queuing System</h1>

      <input
        type="text"
        className="border p-2 w-full rounded mb-2 text-black"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className={`p-2 w-full rounded ${queue.length < 10 ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-500 text-gray-300 cursor-not-allowed"}`}
        onClick={addToQueue}
        disabled={queue.length >= 10}
      >
        Add to Queue
      </button>

      <p className="text-sm text-gray-400 mt-2">Queue Limit: {queue.length}/10</p>

      {/* Queue List (Centered) */}
      <ul className="mt-4 flex flex-col items-center">
        {queue.map((person, index) => (
          <li key={index} className="border p-2 mb-2 rounded w-2/3 text-center">
            {person}
          </li>
        ))}
      </ul>

      <button
        className="bg-red-500 text-white p-2 w-full rounded mt-2"
        onClick={removeFromQueue}
      >
        Remove First
      </button>

      {lastRemoved && (
        <button
          className="bg-green-500 text-white p-2 w-full rounded mt-2"
          onClick={undoLastRemoval}
        >
          Undo Last Removal
        </button>
      )}
    </div>
  );
};

export default Queue;
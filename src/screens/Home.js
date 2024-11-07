import { useEffect, useState } from "react";
import './Home.css';
import axios from 'axios';
import Row from '../components/Row';
import { useUser } from "../contexts/useUser";

const url = 'http://localhost:3001/';

function Home() {
  const { user } = useUser();
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get(url)
      .then(response => {
        setTasks(response.data);
      }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error);
      })
  }, []);

  // Add task to the list
  const addTask = () => {
    const headers = { headers: { Authorization: user.token } }
    axios.post(url + 'create', {
      description: task
    }, headers)
      .then(response => {
        setTasks([...tasks, { id: response.data.id, description: task }]);
        setTask("");
      }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error);
      })
  }

  // Remove task from the list
  const deleteTask = (id) => {
    const headers = { headers: { Authorization: user.token } }
    axios.delete(url + 'delete/' + id, headers)
      .then(response => {
        const withoutRemoved = tasks.filter(item => item.id !== id);
        setTasks(withoutRemoved);
      }).catch(error => {
        alert(error.response.data.error ? error.response.data.error : error);
      })
  }

  return (
    <div id="container">
      <h3>Todos</h3>
      <form>
        <input
          placeholder="Add new task"
          value={task}
          onChange={e => setTask(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTask();
            }
          }}
        />
      </form>
      <ul>
        {tasks.map(item => (
          <Row key={item.id} item={item} deleteTask={deleteTask} />
        ))}
      </ul>
    </div>
  );
}

export default Home;

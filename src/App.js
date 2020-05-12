import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [streamMode, setStreamMode] = useState(false);

  useEffect(() => {
    const usersSaved = localStorage.getItem('save')
    if (usersSaved === null) return;
    setUsers(JSON.parse(usersSaved))
  }, [])

  useEffect(() => {
    localStorage.setItem('save', JSON.stringify(users))
  }, [users])

  function reset() {
    localStorage.removeItem('save')
    setUsers([])
  }

  function handleNewUserChange(e) {
    setNewUser(e.target.value)
  }

  function createNewUser() {
    if (!newUser || newUser === "") return
    setUsers([
      ...users,
      {
        name: newUser,
        points: 0
      }
    ])
    setNewUser('')
  }

  function incrementPoints(name) {
    setUsers(users.map((item) => {
      if (item.name === name) item.points += 1;
      return item;
    }))
  }

  function decrementPoints(name) {
    setUsers(users.map((item) => {
      if (item.name === name) item.points -= 1;
      return item;
    }))
  }

  function remove(name) {
    setUsers(users.filter((item) => item.name !== name))
  }

  function getColor(index, points) {
    if (points === 0) index = Number.MAX_SAFE_INTEGER
    switch (index) {
      case 0:
        return "w-10/12 md:w-1/3 shadow py-4 px-6 rounded-lg bg-yellow-400 mb-4"
      case 1:
        return "w-10/12 md:w-1/3 shadow py-4 px-6 rounded-lg bg-gray-400 mb-4"
      case 2:
        return "w-10/12 md:w-1/3 shadow py-4 px-6 rounded-lg bg-orange-400 mb-4"
      default:
        return "w-10/12 md:w-1/3 shadow py-4 px-6 rounded-lg bg-gray-200 mb-4"
    }
  }

  function getRank(points) {
    const ranks = users.reduce((previous, current) => {
      if (previous.includes(current.points)) return previous;

      return [
        ...previous,
        current.points
      ]
    }, [])

    return ranks.indexOf(points)
  }

  function setStreamerMode() {
    setStreamMode(!streamMode)
  }

  return (
    <div className={streamMode ? "App greenscreen min-h-screen" : "App pattern min-h-screen"}>
      <div className="py-4 bg-purple-900 flex justify-center w-full relative">
        <h1 className="text-2xl font-bold text-white">Leaderboard maker</h1>
        <div>
          <button className="bg-transparent text-white border-2 border-white rounded px-4 py-1 absolute left-0 top-0 mt-4 ml-4" onClick={setStreamerMode}>Streamer mode</button>
          <button className="bg-transparent text-white border-2 border-white rounded px-4 py-1 absolute right-0 top-0 mt-4 mr-4" onClick={reset}>Reset app</button>
        </div>

      </div>


      <div className="flex justify-center my-4 ">
        <div className="w-10/12 md:w-1/3 shadow py-4 px-6 bg-white rounded-lg">
          <p className="text-center text-lg font-semibold">Create a new user</p>
          <div className="flex justify-center mt-2">
            <input className="rounded-l-lg bg-gray-200 border-2 border-purple-900 px-2" type="text" value={newUser} onChange={handleNewUserChange} />
            <button className="px-4 bg-purple-900 rounded-r-lg text-white font-semibold text-xs uppercase" onClick={createNewUser}>Ok</button>
          </div>

        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        {users.length > 0 && users
          .sort((a, b) => b.points - a.points)
          .map((item, i) => (
            <div className={getColor(getRank(item.points), item.points)} key={item.name}>
              <div className="flex w-full items-center justify-between relative">
                <p className="flex justify-start items-align w-1/4 lg:w-2/4">{getRank(item.points) + 1}. <span className="font-bold underline truncate">{item.name}</span> {getRank(item.points) === 0 && item.points !== 0 && (<div className="px-2 py-1 absolute trophy bg-white rounded-full"><svg className="fill-current text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui" d="M11 20v-2.08a6 6 0 0 1-4.24-3A4.02 4.02 0 0 1 2 11V6c0-1.1.9-2 2-2h2c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v5a4 4 0 0 1-4.76 3.93A6 6 0 0 1 13 17.92V20h4a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2h4zm6.92-7H18a2 2 0 0 0 2-2V6h-2v6c0 .34-.03.67-.08 1zM6.08 13A6.04 6.04 0 0 1 6 12V6H4v5a2 2 0 0 0 2.08 2zM8 4v8a4 4 0 1 0 8 0V4H8z" /></svg>
                </div>)}</p>
                <p className="w-1/4 text-center"><span className="font-bold">{item.points}</span> pts</p>
                <div className="flex justify-end align-items w-1/4">
                  <button className="px-2 rounded-full bg-white opacity-50 mr-1" onClick={() => decrementPoints(item.name)}>-</button>
                  <button className="px-2 rounded-full bg-white opacity-50 mr-1" onClick={() => incrementPoints(item.name)}>+</button>
                  <button className="px-2 rounded-full bg-white opacity-50" onClick={() => remove(item.name)}><svg xmlns="http://www.w3.org/2000/svg" className="w-4" viewBox="0 0 24 24" width="24" height="24"><path d="M8 6V4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2h5a1 1 0 0 1 0 2h-1v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8H3a1 1 0 1 1 0-2h5zM6 8v12h12V8H6zm8-2V4h-4v2h4zm-4 4a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1z" /></svg>
                  </button>
                </div>
              </div>



            </div>
          ))}
      </div>
    </div>
  );
}

export default App;

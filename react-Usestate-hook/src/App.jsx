
import './App.css'
import { useState } from 'react'


export default function App() {
  const [count, setCount] = useState(0);

  function buttonClicked(){
    setCount(count+1);
  }

  return (
   <button
   onClick={buttonClicked}
   >Click me {count} </button>
  )
}


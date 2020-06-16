import React, { useCallback, useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"

export default function Login(props) {
  const [name, setName] = useState('')
  const [userCode, setUserCode] = useState('')

  const handleNameChange = useCallback((e) => {
    setName(e.target.value)
  }, [setName])
  const handleUserCodeChange = useCallback((e) => {
    setUserCode(e.target.value)
  }, [setUserCode])

  const handleLogin = useCallback(() => {
    props.login(name, userCode)
  }, [name, userCode])

  return (
    <div>
      <div>
        <div>userName</div><input type={'text'} onChange={handleNameChange}/>
        <div>userCode</div><input type={'text'} onChange={handleUserCodeChange} />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
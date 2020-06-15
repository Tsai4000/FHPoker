import React, { useCallback, useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"

export default function Login() {

  const handleLogin = useCallback

  return (
    <div>
      <div>
        <div>userName</div><input type={'text'} id={'name'} />
        <div>userCode</div><input type={'text'} id={'useCode'} />
      </div>
      <button>Login</button>
    </div>
  )
}
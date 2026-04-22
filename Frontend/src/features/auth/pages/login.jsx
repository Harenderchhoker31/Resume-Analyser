import React from 'react'

const login = () => {
  return (
    <main>
        <div className='formcontainer'>
            <h1>Login</h1>
            <form>
                <div className='input-group'>
                    <label for="email">email</label>
                    <input type="email" id="email" name="email" idplaceholder='Enter Your Email'/>
                </div>
                <div className='input-group'>
                    <label for="password">Password</label>"
                    <input type="password" id="password" name="password" idplaceholder='Enter Your Password'/>
                </div>
                <button className=''>Login</button>
            </form>
        </div>
    </main>
  )
}

export default login

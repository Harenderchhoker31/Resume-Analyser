import React from 'react'
import '../form.scss'

const login = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
    }
  return (
    <main>
        <div className='formcontainer'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className='input-group'>
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder='Enter Email'/>
                </div>
                <div className='input-group'>
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder='Enter Password'/>
                </div>
                <button className='button primary-button'>Login</button>
            </form>
        </div>
    </main>
  )
}

export default login

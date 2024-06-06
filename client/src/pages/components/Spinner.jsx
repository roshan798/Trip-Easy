import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Spinner = ({ path = 'login' }) => {
    const [count, setCount] = useState(3)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue)
        }, 1000)
        count === 0 &&
            navigate(`/${path}`, {
                state: location.pathname,
            })
        return () => clearInterval(interval)
    }, [count, navigate, location, path])

    return (
        <>
            <div
                className='flex flex-col items-center justify-center'
                style={{ height: '100vh' }}>
                <h1 className='me-2 text-center text-2xl'>
                    Redirecting you in {count}
                </h1>
                <div className='spinner-border' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                </div>
            </div>
        </>
    )
}

export default Spinner

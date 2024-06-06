import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const History = () => {
    const { currentUser } = useSelector((state) => state.user)
    const [allBookings, setAllBookings] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [search, setSearch] = useState('')

    const getAllBookings = async () => {
        try {
            setLoading(true)
            const res = await fetch(
                `/api/booking/get-allBookings?searchTerm=${search}`
            )
            const data = await res.json()
            if (data?.success) {
                setAllBookings(data?.bookings)
                setLoading(false)
                setError(false)
            } else {
                setLoading(false)
                setError(data?.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllBookings()
    }, [search])

    const handleHistoryDelete = async (id) => {
        try {
            setLoading(true)
            const res = await fetch(
                `/api/booking/delete-booking-history/${id}/${currentUser._id}`,
                {
                    method: 'DELETE',
                }
            )
            const data = await res.json()
            if (data?.success) {
                setLoading(false)
                alert(data?.message)
                getAllBookings()
            } else {
                setLoading(false)
                alert(data?.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex w-full justify-center'>
            <div className='flex w-[95%] flex-col gap-2 rounded-lg p-3 shadow-xl'>
                <h1 className='text-center text-2xl'>History</h1>
                {loading && (
                    <h1 className='text-center text-2xl'>Loading...</h1>
                )}
                {error && <h1 className='text-center text-2xl'>{error}</h1>}
                <div className='w-full border-b-4'>
                    <input
                        className='mb-2 rounded-lg border p-2'
                        type='text'
                        placeholder='Search Username or Email'
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                    />
                </div>
                {!loading &&
                    allBookings &&
                    allBookings.map((booking, i) => {
                        return (
                            <div
                                className='flex w-full flex-wrap items-center justify-between gap-3 overflow-auto border-y-2 p-3'
                                key={i}>
                                <Link
                                    to={`/package/${booking?.packageDetails?._id}`}>
                                    <img
                                        className='h-12 w-12'
                                        src={
                                            booking?.packageDetails
                                                ?.packageImages[0]
                                        }
                                        alt='Package Image'
                                    />
                                </Link>
                                <Link
                                    to={`/package/${booking?.packageDetails?._id}`}>
                                    <p className='hover:underline'>
                                        {booking?.packageDetails?.packageName}
                                    </p>
                                </Link>
                                <p>{booking?.buyer?.username}</p>
                                <p>{booking?.buyer?.email}</p>
                                <p>{booking?.date}</p>
                                {(new Date(booking?.date).getTime() <
                                    new Date().getTime() ||
                                    booking?.status === 'Cancelled') && (
                                    <button
                                        onClick={() => {
                                            handleHistoryDelete(booking._id)
                                        }}
                                        className='rounded bg-red-600 p-2 text-white hover:opacity-95'>
                                        Delete
                                    </button>
                                )}
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}

export default History

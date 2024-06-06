import { Rating } from '@mui/material'
import React from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

const RatingCard = ({ packageRatings }) => {
    return (
        <>
            {packageRatings &&
                packageRatings.map((rating, i) => {
                    return (
                        <div
                            key={i}
                            className='main relative flex w-max min-w-[280px] max-w-[280px] flex-col gap-2 rounded-lg border p-3'
                            id='main'>
                            <div className='flex items-center gap-2'>
                                <img
                                    src={
                                        rating.userProfileImg ||
                                        defaultProfileImg
                                    }
                                    alt={rating.username[0]}
                                    className='h-6 w-6 rounded-[50%] border border-black'
                                />
                                <p className='font-semibold'>
                                    {rating.username}
                                </p>
                            </div>
                            <Rating
                                value={rating.rating || 0}
                                readOnly
                                size='small'
                                precision={0.1}
                            />
                            {/* review */}
                            <p className='break-all'>
                                <span
                                    className='break-all'
                                    id={
                                        rating.review.length > 90
                                            ? 'review-text'
                                            : 'none'
                                    }>
                                    {rating.review !== ''
                                        ? rating.review.length > 90
                                            ? rating.review.substring(0, 45)
                                            : rating.review
                                        : rating.rating < 3
                                          ? 'Not Bad'
                                          : 'Good'}
                                </span>
                                {rating.review.length > 90 && (
                                    <>
                                        <button
                                            id='more-btn'
                                            className={`m-1 items-center gap-1 font-semibold ${
                                                rating.review.length > 90
                                                    ? 'flex'
                                                    : 'hidden'
                                            }`}
                                            onClick={() => {
                                                document.getElementById(
                                                    'popup'
                                                ).style.display = 'block'
                                                document.getElementById(
                                                    'popup'
                                                ).style.zIndex = '99'
                                            }}>
                                            More
                                            <FaArrowDown />
                                        </button>
                                    </>
                                )}
                            </p>
                            {/* full review */}
                            {rating.review.length > 90 && (
                                <div
                                    className='popup absolute left-0 top-0 hidden bg-white'
                                    id='popup'>
                                    <div
                                        key={i}
                                        className='relative flex w-max min-w-[280px] max-w-[280px] flex-col gap-2 rounded-lg border p-3'>
                                        <div className='flex items-center gap-2'>
                                            <img
                                                src={
                                                    rating.userProfileImg ||
                                                    defaultProfileImg
                                                }
                                                alt={rating.username[0]}
                                                className='h-6 w-6 rounded-[50%] border border-black'
                                            />
                                            <p className='font-semibold'>
                                                {rating.username}
                                            </p>
                                        </div>
                                        <Rating
                                            value={rating.rating || 0}
                                            readOnly
                                            size='small'
                                            precision={0.1}
                                        />
                                        {/* review */}
                                        <p className='break-all'>
                                            <span
                                                className='break-all'
                                                id={
                                                    rating.review.length > 90
                                                        ? 'review-text'
                                                        : 'none'
                                                }>
                                                {rating.review}
                                            </span>
                                            {rating.review.length > 90 && (
                                                <>
                                                    <button
                                                        id='less-btn'
                                                        className={`m-1 flex items-center gap-1 font-semibold`}
                                                        onClick={() => {
                                                            document.getElementById(
                                                                'popup'
                                                            ).style.display =
                                                                'none'
                                                        }}>
                                                        Less
                                                        <FaArrowUp />
                                                    </button>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {/* full review */}
                        </div>
                    )
                })}
        </>
    )
}

export default RatingCard

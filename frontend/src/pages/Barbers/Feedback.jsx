/* eslint-disable react/prop-types */
import { formateDate } from '../../utils/formateDate';
import { AiFillStar } from 'react-icons/ai';
import { useState } from 'react';
import FeedbackForm from './FeedbackForm';
import Loader from '../../components/Loading/Loading.jsx'

const Feedback = ({reviews, loading}) => {

    const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  return (
      <div>
          <div className="mb-[50px]">
              <h4 className="text-[20px] leading-[30px] font-bold text-headingColor my-4">
                  All reviews ({reviews.length})
              </h4>

            {loading && <Loader />}

              {!loading &&
               reviews?.map((review, index) => 
                (<div key={index} className="flex justify-between gap-4 mb-[30px]">
                <div className="flex space-x-4">
                    <figure className="w-10 h-10 rounded-full">
                        <img className="w-full rounded-full h-full object-cover object-top" src={review?.customer?.profilePicture.url} alt="" />
                    </figure>

                    <div className='w-5/6'>
                        <h5 className='text-[16px] leading-6 text-primaryColor font-bold'>
                            {review?.customer?.name}
                        </h5>
                        <p className='text-[14px] leading-6 text-textColor'>
                            {`${formateDate(review?.createdAt)}`}
                        </p>
                        <p className='text__para mt-3 font-medium text-[15px]'>
                            {review.comment}
                        </p>
                    </div>
                </div>

                  {/* ==== Rating Stars ===== */}
                <div className='flex gap-1'>
                    {[...Array(review?.rating).keys()].map((...index) => (
                        <AiFillStar key={index} color='#0067FF' />
                    ))}
                </div>
            </div>
            )
              )} 
          </div>

            {/* === Give Feedback btn ==== */}
          {!showFeedbackForm &&
              <div className='text-center'>
                  <button className='btn' onClick={() => setShowFeedbackForm(true)}>
                      Give Feedback
                  </button>
              </div>}
          
          {showFeedbackForm && <FeedbackForm/>}
    </div>
  )
}

export default Feedback;
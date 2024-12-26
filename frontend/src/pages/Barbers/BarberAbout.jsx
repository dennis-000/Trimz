/* eslint-disable react/prop-types */
import { formateDate } from '../../utils/formateDate'

const BarberAbout = ({name, about, achievements, experience}) => {
  return (
      <div>
          <div>
              <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold
              flex items-center gap-2'>About of
                  <span className='text-irisBlueColor font-bold text-[20px] leading-9'>
                      {name}
                  </span>
              </h3>
              <p className="text__para">
                  {about}
              </p>
          </div>

            {/* ====== ABOUT SPECIFIC (EDUCATION) ====== */}
          <div className='mt-12'>
              <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold'>
              Achievements
              </h3>

               {/* ====== MAIN ====== */}
              <ul className='pt-4 md:p-5'>

                {achievements?.map((item,index)=>   <li key={index} className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]'>
                      <div>
                          <span className='text-irisBlueColor text-[15px] leading-6 font-semibold'>
                              {formateDate(item.startingDate)} - {formateDate(item.endingDate)}
                          </span>
                          {/* <p className='text-[16px] leading-6 font-medium text-textColor'>
                          Type Of Achievement
                          </p> */}
                      </div>
                      <p className='text-[14px] leading-5 font-medium text-textColor'>
                      {item.achievement}
                          </p>
                  </li>
)}
                 {/* ======1ST====== */}
               
                  {/* =====2ND======== */}
                  
              </ul>
          </div>


        {/* ====== ABOUT SPECIFIC ====== */}
          <div className='mt-12'>
              <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold'>
                  Experience
              </h3>
              <ul className='grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5'>

                {experience?.map((item,index)=>         <li key={index} className='p-4 rounded bg-[#fff9ea]'>
                      <span className='text-yellowColor text-[15px] leading-6 font-semibold'>
                        {formateDate(item.startingDate)} - {formateDate(item.endingDate)}
                      </span>
                      <p className='text-[16px] leading-6 font-medium text-textColor'>
                              {item.experience}
                      </p>
                      <p className='text-[14px] leading-5 font-medium text-textColor'>
                              {item.experience}
                        </p>
                  </li>)}
                    {/* ===== 1st ======== */}
          

                    {/* ===== 2nd ======== */}
                 
              </ul>
          </div>
    </div>
  )
}

export default BarberAbout
import { formatDate } from '../../utils/formateDate'

const BarberAbout = ({name, about, achievements, experience}) => {
  return (
      <div>
          <div>
              <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold
              flex items-center gap-2'>About of
                  <span className='text-irisBlueColor font-bold text-[20px] leading-9'>
                      Sadiqq Ahmed
                  </span>
              </h3>
              <p className="text__para">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur
                  blanditiis repellendus distinctio aspernatur, minima iure dolorem nostrum ut
                  maxime, dolor at eius. Dolorum rem quaerat labore esse quasi? Nobis, alias.
              </p>
          </div>

            {/* ====== ABOUT SPECIFIC (EDUCATION) ====== */}
          <div className='mt-12'>
              <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold'>
              Achievements
              </h3>

               {/* ====== MAIN ====== */}
              <ul className='pt-4 md:p-5'>
                 {/* ======1ST====== */}
                  <li className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]'>
                      <div>
                          <span className='text-irisBlueColor text-[15px] leading-6 font-semibold'>
                              {formatDate('03-04-2010')} - {formatDate('04-04-2010')}
                          </span>
                          {/* <p className='text-[16px] leading-6 font-medium text-textColor'>
                          Type Of Achievement
                          </p> */}
                      </div>
                      <p className='text-[14px] leading-5 font-medium text-textColor'>
                      Type Of Achievement
                          </p>
                  </li>

                  {/* =====2ND======== */}
                  <li className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]'>
                      <div>
                          <span className='text-irisBlueColor text-[15px] leading-6 font-semibold'>
                              {formatDate('12-04-2010')} - {formatDate('12-04-2010')}
                          </span>
                          {/* <p className='text-[16px] leading-6 font-medium text-textColor'>
                          Type Of Achievement
                          </p> */}
                      </div>
                      <p className='text-[14px] leading-5 font-medium text-textColor'>
                      Type Of Achievement
                          </p>
                  </li>
              </ul>
          </div>


        {/* ====== ABOUT SPECIFIC ====== */}
          <div className='mt-12'>
              <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold'>
                  Experience
              </h3>
              <ul className='grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5'>
                    {/* ===== 1st ======== */}
                  <li className='p-4 rounded bg-[#fff9ea]'>
                      <span className='text-yellowColor text-[15px] leading-6 font-semibold'>
                        {formatDate('12-04-2010')} - {formatDate('12-04-2010')}
                      </span>
                      <p className='text-[16px] leading-6 font-medium text-textColor'>
                              Grooming
                      </p>
                      <p className='text-[14px] leading-5 font-medium text-textColor'>
                              Place of Education
                        </p>
                  </li>

                    {/* ===== 2nd ======== */}
                  <li className='p-4 rounded bg-[#fff9ea]'>
                      <span className='text-yellowColor text-[15px] leading-6 font-semibold'>
                        {formatDate('12-04-2010')} - {formatDate('12-04-2010')}
                      </span>
                      <p className='text-[16px] leading-6 font-medium text-textColor'>
                              Grooming
                      </p>
                      <p className='text-[14px] leading-5 font-medium text-textColor'>
                              Place of Education
                        </p>
                  </li>
              </ul>
          </div>
    </div>
  )
}

export default BarberAbout
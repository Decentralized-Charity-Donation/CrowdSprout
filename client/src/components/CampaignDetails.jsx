import React from 'react';

const CampaignDetails = () => {

  return (
    <div>

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src="https://via.placeholder.com/410" alt="campaign" className="w-full h-[410px] object-cover rounded-xl"/>
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <div className="text-center">
            <h4 className="font-semibold text-[18px] text-white">Days Left</h4>
            <p className="text-white">100</p>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-[18px] text-white">Raised of</h4>
            <p className="text-white">100 ETH</p>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-[18px] text-white">Total Backers</h4>
            <p className="text-white">2</p>
          </div>
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-semibold text-[18px] text-white uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src="https://via.placeholder.com/52" alt="user" className="w-[60%] h-[60%] object-contain"/>
              </div>
              <div>
                <h4 className="font-semibold text-[14px] text-white">name</h4>
                <p className="mt-[4px] text-[12px] text-[#808191]">10 Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[18px] text-white uppercase">Story</h4>
            <div className="mt-[20px]">
              <p className="text-[16px] text-[#808191] leading-[26px] text-justify">description</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[18px] text-white uppercase">Donators</h4>
            <div className="mt-[20px] flex flex-col gap-4">
              <p className="text-[16px] text-[#808191] leading-[26px]">No donators yet. Be the first one!</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-[18px] text-white uppercase">Fund</h4>   

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="text-[20px] text-center text-[#808191]">Fund the campaign</p>
            <div className="mt-[30px]">
              <input 
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] px-[15px] border-[1px] border-[#3a3a43] bg-transparent text-white text-[18px] placeholder-[#4b5264] rounded-[10px]"
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-semibold text-[14px] text-white">Back it because you believe in it.</h4>
                <p className="mt-[20px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
              </div>

              <button 
                type="button" 
                className="w-full bg-[#8c6dfd] py-3 rounded-[10px] text-white font-semibold"
              >
                Fund Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails;

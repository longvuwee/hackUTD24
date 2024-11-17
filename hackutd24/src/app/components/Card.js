import React from 'react'

export  default function Card(props){
  return <>
    <div className="h-[215px] w-[400px] bg-custom-dark border rounded-[20px] relative border-none text-white font-montserrat scale-75">
      <div className="absolute top-[-14px] h-auto w-[200px] pl-4 bg-custom-purple rounded-lg rounded-bl-none font-bold text-[25px] shadow-[0px_4px_20px_0px_#7A2DCB] shadow-custom-purple">{props.title}</div>
      <div className="mt-8 text-[15px] font-light py-4 px-5 font-regular">{props.description}</div>
      <div className="mt-2 flex w-full justify-around items-center divide-x divide-white text-[20px]">
        <div className="flex-1 text-center font-light leading-loose"><b className="font-bold">{props.files}</b><br/>Files</div>
        <div className="flex-1 text-center font-light leading-loose"><b className="font-bold">{props.editors}</b><br/>Editors</div>
        <div className="flex-1 text-center font-light leading-loose"><b className="font-bold">{props.storage}</b><br/>Storage</div>
      </div>
    </div>
  </>
} 
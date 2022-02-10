import React, { useState } from 'react'
import { SliderData } from './SliderData'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import {ReactComponent as YourSvg1 } from "../assets/login/Graph.svg"
import {ReactComponent as YourSvg0 } from "../assets/login/Folder.svg"
import {ReactComponent as YourSvg2 } from "../assets/login/Shield.svg"
 
const Slider = ({ slides }) => {
  const [current, setCurrent] = useState(0)
  const length = slides.length

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1)
  }

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1)
  }
  console.log(current)

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null
  }

  
  return (
    <section className="relative h-full w-full ">
      <MdKeyboardArrowLeft className="absolute font-black text-2xl text-white top-2/4 left-4 z-10 cursor-pointer select-none" onClick={prevSlide} />
      <MdKeyboardArrowRight className="absolute right-arrow font-black text-2xl z-10 text-white cursor-pointer select-none top-2/4 right-4" onClick={nextSlide} />
      {SliderData.map((slide, index) => {
        return (
          <div className={index === current ? 'opacity-100 duration-200 h-full w-full ' : 'opacity-0 transition duration-200 ease-in-out'} key={index}>
            {index === current && (
              <div className="relative h-full w-full justify-center items-center flex">
              {current === 0 ? <YourSvg0 className="w-24 h-24 mx-auto absolute top-32"/>:null}
              {current === 1 ? <YourSvg2 className="w-24 h-24 mx-auto absolute top-32"/>:null}
              {current === 2 ? <YourSvg1 className="w-24 h-24 mx-auto absolute top-32"/>:null}
                <p className="absolute text-white font-bold text-4xl mx-16 text-center justify-center items-center ">{slide.text}</p>
                <img src={slide.image} alt="Carousel" className="w-full h-full object-cover rounded-r-xl" />
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

export default Slider
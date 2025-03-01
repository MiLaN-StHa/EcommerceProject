import React from "react";
import Title from "../components/Title";
import about from "../assets/aboutus.jpg";

const About = () => {
  return (
    <div>
      <div className=" text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className=" my-10 flex flex-col md:flex-row gap-16">
        <img className=" w-full md:max-w-[450px]" src={about} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Naomi Collections was born from a deep love for artistry and a
            desire to redefine the way people experience jewelry and accessories
            online. Our journey started with a simple vision: to create a space
            where customers can effortlessly discover, explore, and adorn
            themselves with beautifully crafted, unique pieces from the comfort
            of their homes.
          </p>
          <p>
            Since the beginning, we have been committed to curating an
            exceptional collection of handcrafted jewelry and accessories that
            appeal to a variety of styles and preferences. From timeless
            classics to modern statement pieces, our selection reflects our
            dedication to quality, creativity, and individuality. Each piece is
            sourced from skilled artisans and trusted suppliers to ensure that
            every product embodies both beauty and craftsmanship.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
          At Naomi Collections, our mission is to inspire confidence and self-expression through thoughtfully designed jewelry and accessories. We aim to provide a seamless and enjoyable shopping experience, where every customer feels empowered to find the perfect piece that complements their unique style. From browsing our collections to receiving your beautifully packaged order, we're here to make every step of the journey effortless and enjoyable.
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className=" border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
        <b>Quality Assurance:</b>
        <p className=" text-gray-600">We carefully handpick and design each piece of jewelry to ensure it meets our high standards of quality, elegance, and durability.</p>
        </div>
        <div className=" border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
        <b>Effortless Shopping:</b>
        <p className=" text-gray-600">With a seamless and user-friendly interface, Naomi Collections makes finding and purchasing your perfect accessory a simple and enjoyable experience.</p>
        </div>
        <div className=" border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
        <b>Exceptional Customer Care:</b>
        <p className=" text-gray-600">Our team of passionate experts is committed to providing top-notch service at every step of your journey, ensuring that your satisfaction is always our priority.</p>
        </div>
      </div>

    </div>
  );
};

export default About;

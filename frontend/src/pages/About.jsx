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
      

    </div>
  );
};

export default About;


import React, { useEffect, useRef } from "react";
import Head from "next/head";
import tw from "tailwind-styled-components";
import * as THREE from "three";

const Container = tw.div`
  flex
  flex-col
  min-h-screen
`;

const Header = tw.header`
  flex
  items-center
  justify-between
  py-4
  px-6
  bg-white
  shadow-sm
`;

const Logo = tw.img`
  w-16
  h-16
`;

const Nav = tw.nav`
  flex
  items-center
`;

const NavLink = tw.a`
  text-gray-600
  hover:text-gray-800
  ml-6
`;

// const CTAButton = tw.button`
//   px-6
//   py-3
//   text-white
//   font-semibold
//   rounded-full
//   bg-gradient-to-r from-blue-500 to-purple-500
//   hover:bg-gradient-to-r from-blue-600 to-purple-600
//   shadow-lg
// `;

const SceneContainer = tw.div`
  flex-1
  overflow-hidden
`;

const Footer = tw.footer`
  py-4
  px-6
  bg-gray-200
  shadow-sm
`;

const Description = tw.div`
  py-4
`;

export default function Home() {
  return (
    <Container >
      <Head>
        <title>My 3D Website</title>
      </Head>
      {/* <Header>
        <Logo src="/logo.png" />
      </Header> */}
      <section className="justify-evenly py-12 w-6/12 px-12 ">
       
        <h1 className="text-center md:text-left text-6xl font-bold py-4 text-white">
          Welcome to [Website Name], the ultimate platform for creating and enhancing 3D models!
        </h1>
          <p className="text-left text-lg py-4">
            Our website is designed to provide you with the tools and resources you need to create stunning 3D models and take your design skills to the next level. With our easy-to-use 3D model editor, you can shape, texture, and add details to your models with ease. Whether you're a seasoned professional or just starting out, our editor offers everything you need to create the perfect model.
          </p>
          
          <button className=" p-6 inline-flex items-center h-10 px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">Interact</button>
          

      </section>
      
    </Container>
  );
};


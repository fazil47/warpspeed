import React from "react";
import Head from "next/head";
import tw from "tailwind-styled-components";
import Image from "next/image";
import Link from "next/link";

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
    <Container>
      <Head>
        <title>My 3D Website</title>
      </Head>
      
      <SceneContainer>
        <section className="flex flex-row justify-evenly py-12 w-full px-12">
          <div className="flex mr-0 flex-col justify-center w-1/2">
            <h1 className="flex pl-16 justify-stretch text-center md:text-left text-6xl font-bold py-4 text-white">
              Welcome to the ultimate platform for creating 3d models and enhancing respective picture!
            </h1>
            <p className=" flex pl-16 justify-stretch  text-left text-lg py-4 text-white">
              Our website is designed to provide you with the tools and resources you need to create stunning 3D models
              and take your design skills to the next level. With our easy-to-use 3D model editor, you can shape, texture,
              and add details to your models with ease. Whether you're a seasoned professional or just starting out, our
              editor offers everything you need to create the perfect model. You can enhance the shape, texture and other detail of the picture of 3d object using generative AI, in our platform. 
            </p>
            <div className="flex flex-col items-center justify-center" >
              <Link href="/editor">
                <button className="h-12 w-64 mt-12 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800" >Start</button>
              </Link>
            </div>
          </div>
          <div className="rounded-full">
            <Image
              src="/hahaha.png"
              alt="3D image"
              width={800}
              height={600}
              objectFit="cover"
              className="object-cover w-full h-full"
            />
          </div>
        </section>
      </SceneContainer>
      
    </Container>
  );
}

import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "../atoms/button.jsx";
import { useState, useEffect } from "react";

export function HeroSection({ backgroundImage }) {
  return (
    <section className="relative h-[600px] bg-gray-900 flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
       "Vestiu-me com as vestes da salvação."
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          -Isaías 61:10
        </p>
      </div>
    </section>
  );
}
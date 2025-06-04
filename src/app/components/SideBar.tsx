// components/Sidebar.tsx
'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaTimes, FaHome, FaServicestack, FaEnvelope } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { VscRobot } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Botón hamburguesa visible solo en mobile */}
            <div className="flex items-center gap-2 justify-between bg-white px-4 py-2 md:hidden">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 focus:outline-none z-50 relative"
                    aria-label="Abrir menú"
                >
                    {isOpen ? <FaTimes size={24} /> : <IoIosMenu size={24} />}
                </button>
                <h1 className="w-full">Dashboard</h1>
                <div className="flex items-center w-10 h-10 rounded-full overflow-hidden">
                    <Image
                        src="https://my-page-negiupp.s3.amazonaws.com/1749047812276.png"
                        alt="Logo"
                        width={150}
                        height={50}
                        className="mx-auto my-4" />
                </div>
            </div>
            {/* Overlay para cerrar al hacer clic afuera */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/55 bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0  border-r-1 border-r-gray-200 left-0 min-h-screen w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:shadow-none`}
                role="navigation"
            >
                <nav className="p-4 space-y-4">
                    <div className="w-6 h-6 m-4">
                        <Image
                            src="/assets/logo-icon.png"
                            alt="Logo"
                            width={150}
                            height={50}
                            className="mx-auto my-4"
                        />
                    </div>
                    <ul className="space-y-2">
                        <li className="group">
                            <Link href="/" className="flex items-center gap-2 p-2 hover:bg-[#f9fafb] rounded group-hover:text-[#7a02fb] transition-all duration-300">
                                <FaHome  size={25}  className="text-gray-300 group-hover:text-[#7a02fb] transition-all duration-300" />
                                Dashboard
                            </Link>
                        </li>
                        <li className="group">
                            <Link href="/agents" className="flex items-center gap-2 p-2 hover:bg-[#f9fafb] rounded group-hover:text-[#7a02fb] transition-all duration-300">
                        <VscRobot  size={25}  className="text-gray-300 group-hover:text-[#7a02fb] transition-all duration-300" /> Agents
                            </Link>
                        </li>
                        <li className="group">
                            <Link href="/contacto" className="flex items-center gap-2 p-2 hover:bg-[#f9fafb] rounded group-hover:text-[#7a02fb] transition-all duration-300" >
                                <CiSettings size={25} className="text-gray-300 group-hover:text-[#7a02fb] transition-all duration-300" /> Settings
                            </Link>
                        </li>
                        
                    </ul>
                </nav>
            </aside>
        </>
    );
}

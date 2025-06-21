"use client";

import { useState } from "react";
import Navbar from "./navbar";
import Dashboard from "./dashboard/page";

export default function Head(){
    return(
        <div className="min-h-screen bg-white">
            < Dashboard />
        </div>
    )
}
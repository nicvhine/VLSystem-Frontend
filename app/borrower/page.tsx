"use client";

import { useState } from "react";
import Navbar from "./navbar";
import Dashboard from "../head/dashboard";
import HomePage from "./dashboard";

export default function Head(){
    return(
        <div className="min-h-screen bg-white">
           <HomePage />
        </div>
    )
}
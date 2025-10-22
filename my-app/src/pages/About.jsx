import React from 'react'

export default function About(){
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">About eShop</h1>
      <p className="text-gray-700">eShop is a demo e-commerce application built to showcase a simple shopping flow: products, cart, checkout and orders. It demonstrates React + Context for frontend state and Node/Express + MongoDB for backend APIs.</p>
      <p className="mt-4">If you need features (admin panel, payments, email receipts), tell me and I can add them.</p>
    </div>
  )
}

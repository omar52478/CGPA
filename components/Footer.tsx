import { memo } from "react"

// Memoize the Footer component to prevent unnecessary re-renders
const Footer = memo(function Footer() {
  return (
    <footer className="mt-8 text-center text-white/70 py-6">
      <div className="glass-card p-4">
        <h3 className="text-lg font-medium mb-2 gradient-text">GPA & CGPA Calculator</h3>
        <p className="text-sm mb-2">© {new Date().getFullYear()} All Rights Reserved by <span className="text-sm text-white">Omar Kareem</span></p>
        <p className="text-xs">Built with React, Next.js, Three.js, and Tailwind CSS</p>
      </div>
    </footer>
  )
})

export default Footer

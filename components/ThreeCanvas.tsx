"use client"

import { useRef, useEffect, memo } from "react"
import { useAppContext } from "@/context/AppContext"
import * as THREE from "three"

const ThreeCanvas = memo(function ThreeCanvas() {
  const { is3DBackgroundVisible } = useAppContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | null>(null)

  // Initialize Three.js scene
  useEffect(() => {
    // Create scene only once
    if (!sceneRef.current) {
      sceneRef.current = new THREE.Scene()
    }

    return () => {
      // Cleanup on component unmount
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }

      if (rendererRef.current && rendererRef.current.domElement.parentElement) {
        rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement)
      }

      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [])

  // Handle visibility changes
  useEffect(() => {
    if (!containerRef.current) return

    // Clear container
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    // Stop any existing animation
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = null
    }

    // Dispose old renderer
    if (rendererRef.current) {
      rendererRef.current.dispose()
      rendererRef.current = null
    }

    // Only create new renderer if 3D is visible
    if (!is3DBackgroundVisible) return

    // Set up scene
    const scene = sceneRef.current || new THREE.Scene()
    if (!sceneRef.current) sceneRef.current = scene

    // Clear any existing objects from the scene
    while (scene.children.length > 0) {
      const object = scene.children[0]
      scene.remove(object)
    }

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1500

    const posArray = new Float32Array(particlesCount * 3)
    const colorArray = new Float32Array(particlesCount * 3)
    const sizeArray = new Float32Array(particlesCount)

    for (let i = 0; i < particlesCount; i++) {
      // Position
      posArray[i * 3] = (Math.random() - 0.5) * 100
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 100
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 100

      // Color - purple to pink gradient for better match with the background
      colorArray[i * 3] = 0.6 + Math.random() * 0.3 // r - more red for purple/pink
      colorArray[i * 3 + 1] = 0.1 + Math.random() * 0.2 // g - less green for purple
      colorArray[i * 3 + 2] = 0.7 + Math.random() * 0.3 // b - more blue for purple

      // Size variation
      sizeArray[i] = Math.random() * 0.3 + 0.1
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3))
    particlesGeometry.setAttribute("size", new THREE.BufferAttribute(sizeArray, 1))

    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Handle window resize
    const handleResize = () => {
      if (!rendererRef.current) return

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Animation
    const clock = new THREE.Clock()

    const animate = () => {
      if (!rendererRef.current) return

      const elapsedTime = clock.getElapsedTime()

      // Rotate particles slowly
      particlesMesh.rotation.x = elapsedTime * 0.05
      particlesMesh.rotation.y = elapsedTime * 0.03

      // Render
      rendererRef.current.render(scene, camera)

      // Continue animation loop
      animationIdRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = null
      }
    }
  }, [is3DBackgroundVisible])

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: is3DBackgroundVisible ? 0.6 : 0 }}
    />
  )
})

export default ThreeCanvas

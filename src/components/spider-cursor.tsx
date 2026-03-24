'use client'

import { useEffect, useRef } from 'react'

export default function SpiderCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let mouseX = canvas.width / 2
    let mouseY = canvas.height / 2
    const particles: Particle[] = []

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.vx = (Math.random() - 0.5) * 8
        this.vy = (Math.random() - 0.5) * 8
        this.life = 1
        this.maxLife = Math.random() * 0.5 + 0.5
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.vy += 0.2 // gravity
        this.life -= 1 / (this.maxLife * 60)
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.life
        ctx.fillStyle = '#fff'
        ctx.fillRect(this.x, this.y, 2, 2)
        ctx.globalAlpha = 1
      }
    }

    // Track mouse movement (store ref so cleanup can remove the same function)
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      for (let i = 0; i < 3; i++) {
        particles.push(new Particle(mouseX, mouseY))
      }
    }
    document.addEventListener('mousemove', handleMouseMove)

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    let rafId: number
    const animate = () => {
      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw spider body (simple circle)
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2)
      ctx.fill()

      // Draw spider legs (lines radiating from body)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const legLength = 15 + Math.sin(Date.now() / 200 + i) * 5
        const x = mouseX + Math.cos(angle) * legLength
        const y = mouseY + Math.sin(angle) * legLength
        ctx.beginPath()
        ctx.moveTo(mouseX, mouseY)
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      // Draw web lines connecting particles
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update()
        particles[i].draw(ctx)
        if (particles[i].life <= 0) {
          particles.splice(i, 1)
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  )
}

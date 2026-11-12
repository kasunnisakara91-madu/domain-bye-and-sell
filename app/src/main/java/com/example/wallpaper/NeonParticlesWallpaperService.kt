package com.example.wallpaper

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.RadialGradient
import android.graphics.Shader
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.service.wallpaper.WallpaperService
import android.view.MotionEvent
import android.view.SurfaceHolder
import kotlin.math.hypot
import kotlin.random.Random

/**
 * Android Live Wallpaper featuring glowing neon purple and violet particles,
 * moving cosmic gradients, and interactive ripple effects.
 */
class NeonParticlesWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine {
        return NeonParticlesEngine()
    }

    private inner class NeonParticlesEngine : Engine() {
        private val handler = Handler(Looper.getMainLooper())
        private var visible = false
        private var width = 0
        private var height = 0

        private val backgroundPaint = Paint(Paint.ANTI_ALIAS_FLAG)
        private val particlePaint = Paint(Paint.ANTI_ALIAS_FLAG)
        private val glowPaint = Paint(Paint.ANTI_ALIAS_FLAG)
        private val linePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            strokeWidth = 1.5f
            style = Paint.Style.STROKE
        }

        private val particles = mutableListOf<Particle>()
        private val maxParticles = 45
        private var lastFrameTime = SystemClock.uptimeMillis()
        private var gradientOffset = 0f

        // Touch burst effect
        private var touchX = -1f
        private var touchY = -1f
        private var touchRadius = 0f
        private val touchPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 2.5f
            color = Color.parseColor("#C084FC")
        }

        private val drawRunnable = object : Runnable {
            override fun run() {
                drawFrame()
                if (visible) {
                    handler.postDelayed(this, 16) // ~60fps
                }
            }
        }

        override fun onVisibilityChanged(isVisible: Boolean) {
            super.onVisibilityChanged(isVisible)
            visible = isVisible
            if (isVisible) {
                lastFrameTime = SystemClock.uptimeMillis()
                handler.post(drawRunnable)
            } else {
                handler.removeCallbacks(drawRunnable)
            }
        }

        override fun onSurfaceChanged(holder: SurfaceHolder?, format: Int, w: Int, h: Int) {
            super.onSurfaceChanged(holder, format, w, h)
            width = w
            height = h
            initParticles()
        }

        override fun onSurfaceDestroyed(holder: SurfaceHolder?) {
            super.onSurfaceDestroyed(holder)
            visible = false
            handler.removeCallbacks(drawRunnable)
        }

        override fun onTouchEvent(event: MotionEvent?) {
            super.onTouchEvent(event)
            event?.let {
                if (it.action == MotionEvent.ACTION_DOWN || it.action == MotionEvent.ACTION_MOVE) {
                    touchX = it.x
                    touchY = it.y
                    touchRadius = 10f
                    // Repel or excite nearby particles
                    for (p in particles) {
                        val dx = p.x - touchX
                        val dy = p.y - touchY
                        val dist = hypot(dx, dy)
                        if (dist < 200f && dist > 1f) {
                            p.vx += (dx / dist) * 2.5f
                            p.vy += (dy / dist) * 2.5f
                        }
                    }
                }
            }
        }

        private fun initParticles() {
            particles.clear()
            if (width <= 0 || height <= 0) return
            val colors = intArrayOf(
                Color.parseColor("#A855F7"), // Purple 500
                Color.parseColor("#C084FC"), // Purple 400
                Color.parseColor("#8B5CF6"), // Violet 500
                Color.parseColor("#EC4899"), // Pink 500
                Color.parseColor("#38BDF8")  // Cyan accent
            )

            for (i in 0 until maxParticles) {
                particles.add(
                    Particle(
                        x = Random.nextFloat() * width,
                        y = Random.nextFloat() * height,
                        vx = (Random.nextFloat() - 0.5f) * 1.2f,
                        vy = (Random.nextFloat() - 0.5f) * 1.2f,
                        radius = Random.nextFloat() * 4f + 2.5f,
                        baseAlpha = Random.nextInt(120, 240),
                        color = colors[Random.nextInt(colors.size)],
                        pulseSpeed = Random.nextFloat() * 0.04f + 0.02f,
                        pulsePhase = Random.nextFloat() * Math.PI.toFloat() * 2f
                    )
                )
            }
        }

        private fun drawFrame() {
            val holder = surfaceHolder ?: return
            var canvas: Canvas? = null
            try {
                canvas = holder.lockCanvas()
                if (canvas != null && width > 0 && height > 0) {
                    val now = SystemClock.uptimeMillis()
                    val dt = ((now - lastFrameTime) / 1000f).coerceIn(0.001f, 0.05f)
                    lastFrameTime = now

                    gradientOffset += dt * 0.15f
                    if (gradientOffset > 100f) gradientOffset = 0f

                    // 1. Draw animated moving gradient background
                    val gradStartX = (Math.sin(gradientOffset.toDouble()) * width * 0.3f + width * 0.5f).toFloat()
                    val gradStartY = (Math.cos(gradientOffset.toDouble()) * height * 0.2f).toFloat()
                    val gradEndX = width.toFloat()
                    val gradEndY = height.toFloat()

                    val bgShader = LinearGradient(
                        gradStartX, gradStartY, gradEndX, gradEndY,
                        intArrayOf(
                            Color.parseColor("#080511"),
                            Color.parseColor("#150A2E"),
                            Color.parseColor("#260E4A"),
                            Color.parseColor("#0B0717")
                        ),
                        floatArrayOf(0f, 0.4f, 0.8f, 1f),
                        Shader.TileMode.CLAMP
                    )
                    backgroundPaint.shader = bgShader
                    canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), backgroundPaint)

                    // 2. Draw connecting constellation lines
                    val maxLineDist = 140f
                    for (i in 0 until particles.size) {
                        val p1 = particles[i]
                        for (j in i + 1 until particles.size) {
                            val p2 = particles[j]
                            val dx = p1.x - p2.x
                            val dy = p1.y - p2.y
                            val dist = hypot(dx, dy)
                            if (dist < maxLineDist) {
                                val alphaFraction = 1f - (dist / maxLineDist)
                                val lineAlpha = (alphaFraction * 65).toInt().coerceIn(0, 255)
                                linePaint.color = Color.parseColor("#8B5CF6")
                                linePaint.alpha = lineAlpha
                                canvas.drawLine(p1.x, p1.y, p2.x, p2.y, linePaint)
                            }
                        }
                    }

                    // 3. Update & render particles
                    for (p in particles) {
                        p.x += p.vx
                        p.y += p.vy
                        p.pulsePhase += p.pulseSpeed

                        // Bounce on bounds
                        if (p.x < 0) { p.x = 0f; p.vx *= -1 }
                        if (p.x > width) { p.x = width.toFloat(); p.vx *= -1 }
                        if (p.y < 0) { p.y = 0f; p.vy *= -1 }
                        if (p.y > height) { p.y = height.toFloat(); p.vy *= -1 }

                        // Speed decay toward resting speed
                        p.vx *= 0.99f
                        p.vy *= 0.99f
                        if (Math.abs(p.vx) < 0.2f) p.vx = if (p.vx >= 0) 0.4f else -0.4f
                        if (Math.abs(p.vy) < 0.2f) p.vy = if (p.vy >= 0) 0.4f else -0.4f

                        val pulseFactor = (Math.sin(p.pulsePhase.toDouble()).toFloat() + 1f) * 0.5f
                        val currentRadius = p.radius * (0.85f + 0.35f * pulseFactor)
                        val currentAlpha = (p.baseAlpha * (0.6f + 0.4f * pulseFactor)).toInt().coerceIn(20, 255)

                        // Outer glow
                        glowPaint.color = p.color
                        glowPaint.alpha = (currentAlpha * 0.35f).toInt()
                        canvas.drawCircle(p.x, p.y, currentRadius * 2.8f, glowPaint)

                        // Inner particle
                        particlePaint.color = p.color
                        particlePaint.alpha = currentAlpha
                        canvas.drawCircle(p.x, p.y, currentRadius, particlePaint)

                        // Hot center core
                        particlePaint.color = Color.WHITE
                        particlePaint.alpha = (currentAlpha * 0.8f).toInt()
                        canvas.drawCircle(p.x, p.y, currentRadius * 0.45f, particlePaint)
                    }

                    // 4. Draw touch ripple if active
                    if (touchRadius > 0f && touchRadius < 180f) {
                        touchRadius += dt * 260f
                        val rippleAlpha = ((1f - (touchRadius / 180f)) * 200).toInt().coerceIn(0, 255)
                        touchPaint.alpha = rippleAlpha
                        canvas.drawCircle(touchX, touchY, touchRadius, touchPaint)
                    }
                }
            } finally {
                if (canvas != null) {
                    try {
                        holder.unlockCanvasAndPost(canvas)
                    } catch (e: Exception) {
                        // Surface might have been destroyed
                    }
                }
            }
        }
    }

    private data class Particle(
        var x: Float,
        var y: Float,
        var vx: Float,
        var vy: Float,
        var radius: Float,
        var baseAlpha: Int,
        var color: Int,
        var pulseSpeed: Float,
        var pulsePhase: Float
    )
}

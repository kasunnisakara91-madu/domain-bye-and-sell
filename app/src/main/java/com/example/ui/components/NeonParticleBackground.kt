package com.example.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import kotlin.math.hypot
import kotlin.random.Random

@Composable
fun NeonParticleBackground(modifier: Modifier = Modifier) {
    val infiniteTransition = rememberInfiniteTransition(label = "particles")
    val phase by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(12000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "phase"
    )

    // Generate static initial particle vectors
    val particles = remember {
        List(35) {
            ComposeParticle(
                xRatio = Random.nextFloat(),
                yRatio = Random.nextFloat(),
                speedX = (Random.nextFloat() - 0.5f) * 0.15f,
                speedY = (Random.nextFloat() - 0.5f) * 0.15f,
                radius = Random.nextFloat() * 2.5f + 2f,
                color = when (Random.nextInt(4)) {
                    0 -> Color(0xFFA855F7) // Purple
                    1 -> Color(0xFFC084FC) // Light Violet
                    2 -> Color(0xFFEC4899) // Pink
                    else -> Color(0xFF38BDF8) // Cyan
                }
            )
        }
    }

    Canvas(modifier = modifier.fillMaxSize()) {
        val w = size.width
        val h = size.height

        // 1. Moving cosmic gradient background
        val gradOffset = phase * 2f * Math.PI.toFloat()
        val centerX = w * 0.5f + (Math.sin(gradOffset.toDouble()) * w * 0.25f).toFloat()
        val centerY = h * 0.3f + (Math.cos(gradOffset.toDouble()) * h * 0.15f).toFloat()

        drawRect(
            brush = Brush.radialGradient(
                colors = listOf(
                    Color(0xFF260E4A),
                    Color(0xFF140A2C),
                    Color(0xFF080511)
                ),
                center = Offset(centerX, centerY),
                radius = w * 0.9f
            )
        )

        // 2. Render and connect particles
        val maxDist = 180f
        for (i in particles.indices) {
            val p1 = particles[i]
            val x1 = ((p1.xRatio + p1.speedX * phase * 10f) % 1f + 1f) % 1f * w
            val y1 = ((p1.yRatio + p1.speedY * phase * 10f) % 1f + 1f) % 1f * h

            for (j in i + 1 until particles.size) {
                val p2 = particles[j]
                val x2 = ((p2.xRatio + p2.speedX * phase * 10f) % 1f + 1f) % 1f * w
                val y2 = ((p2.yRatio + p2.speedY * phase * 10f) % 1f + 1f) % 1f * h

                val dist = hypot(x1 - x2, y1 - y2)
                if (dist < maxDist) {
                    val alpha = (1f - dist / maxDist) * 0.2f
                    drawLine(
                        color = Color(0xFFA855F7).copy(alpha = alpha),
                        start = Offset(x1, y1),
                        end = Offset(x2, y2),
                        strokeWidth = 1.2f
                    )
                }
            }

            // Outer glow
            drawCircle(
                color = p1.color.copy(alpha = 0.25f),
                radius = p1.radius * 3.5f,
                center = Offset(x1, y1)
            )

            // Core
            drawCircle(
                color = p1.color.copy(alpha = 0.85f),
                radius = p1.radius,
                center = Offset(x1, y1)
            )
        }
    }
}

private data class ComposeParticle(
    val xRatio: Float,
    val yRatio: Float,
    val speedX: Float,
    val speedY: Float,
    val radius: Float,
    val color: Color
)

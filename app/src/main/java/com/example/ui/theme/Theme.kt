package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DomainSellColorScheme = darkColorScheme(
    primary = NeonPurplePrimary,
    onPrimary = Color.White,
    primaryContainer = Color(0xFF3B1F70),
    onPrimaryContainer = Color(0xFFE9D5FF),
    secondary = NeonViolet,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFF2E1758),
    onSecondaryContainer = Color(0xFFDDD6FE),
    tertiary = NeonPinkAccent,
    onTertiary = Color.White,
    tertiaryContainer = Color(0xFF5C113A),
    onTertiaryContainer = Color(0xFFFCE7F3),
    background = DeepBlack,
    onBackground = TextPrimary,
    surface = DarkSurface,
    onSurface = TextPrimary,
    surfaceVariant = DarkSurfaceElevated,
    onSurfaceVariant = TextSecondary,
    outline = GlassBorder
)

@Composable
fun MyApplicationTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DomainSellColorScheme,
        typography = Typography,
        content = content
    )
}

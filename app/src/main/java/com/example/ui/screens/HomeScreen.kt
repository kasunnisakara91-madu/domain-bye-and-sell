package com.example.ui.screens

import android.app.WallpaperManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.models.DomainItem
import com.example.data.repository.DomainSellRepository
import com.example.ui.theme.*
import com.example.wallpaper.NeonParticlesWallpaperService

@Composable
fun HomeScreen(
    repository: DomainSellRepository,
    onNavigate: (String) -> Unit,
    onBuyProduct: (type: String, name: String, domain: String, price: Double) -> Unit
) {
    val context = LocalContext.current
    val currentUsername by repository.currentUsername.collectAsState()
    val domains by repository.domains.collectAsState()
    val apis by repository.apis.collectAsState()
    val bots by repository.bots.collectAsState()

    var searchInput by remember { mutableStateOf("") }
    var verificationMessage by remember { mutableStateOf<String?>(null) }
    var isVerifiedAvailable by remember { mutableStateOf(false) }

    fun launchSetLiveWallpaper() {
        try {
            val intent = Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER).apply {
                putExtra(
                    WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT,
                    ComponentName(context, NeonParticlesWallpaperService::class.java)
                )
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            try {
                val fallbackIntent = Intent(WallpaperManager.ACTION_LIVE_WALLPAPER_CHOOSER)
                context.startActivity(fallbackIntent)
            } catch (ex: Exception) {
                Toast.makeText(context, "Could not open wallpaper manager", Toast.LENGTH_SHORT).show()
            }
        }
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 90.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Top Hero Header
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                // Live Wallpaper CTA Banner
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .border(1.dp, GlassBorder, RoundedCornerShape(16.dp))
                        .clickable { launchSetLiveWallpaper() },
                    color = DarkSurfaceElevated.copy(alpha = 0.85f)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(38.dp)
                                    .clip(CircleShape)
                                    .background(NeonPurplePrimary.copy(alpha = 0.2f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Wallpaper,
                                    contentDescription = "Live Wallpaper",
                                    tint = NeonPinkAccent,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Column {
                                Text(
                                    text = "Neon Live Wallpaper",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = Color.White
                                )
                                Text(
                                    text = "Set interactive purple particles on Home Screen",
                                    fontSize = 11.sp,
                                    color = TextSecondary
                                )
                            }
                        }
                        Button(
                            onClick = { launchSetLiveWallpaper() },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary),
                            shape = RoundedCornerShape(10.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text("Set Wallpaper", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Brand Title
                Text(
                    text = "DOMAIN SELL",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Verified Domains • APIs • WhatsApp Bots",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = NeonViolet
                )
            }
        }

        // Live Domain Availability Search Box
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(DarkSurface.copy(alpha = 0.75f))
                    .border(1.dp, GlassBorder, RoundedCornerShape(20.dp))
                    .padding(16.dp)
            ) {
                Text(
                    text = "CHECK REGISTRY AVAILABILITY",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = NeonPurplePrimary,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = searchInput,
                    onValueChange = {
                        searchInput = it
                        verificationMessage = null
                    },
                    placeholder = { Text("Search domain (e.g. startup.lk, pay.com)", fontSize = 12.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = NeonPurplePrimary,
                        unfocusedBorderColor = GlassBorder,
                        focusedContainerColor = Color.Black.copy(alpha = 0.4f),
                        unfocusedContainerColor = Color.Black.copy(alpha = 0.3f),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    singleLine = true,
                    trailingIcon = {
                        IconButton(onClick = {
                            if (searchInput.trim().isNotEmpty()) {
                                val clean = searchInput.trim().lowercase()
                                val exists = domains.any { it.name.equals(clean, ignoreCase = true) }
                                if (exists) {
                                    val item = domains.first { it.name.equals(clean, ignoreCase = true) }
                                    isVerifiedAvailable = item.status == "available"
                                    verificationMessage = if (isVerifiedAvailable) "Verified Available in marketplace!" else "Domain is ${item.status}"
                                } else {
                                    isVerifiedAvailable = true
                                    verificationMessage = "Verified available for instant registration and manual unlock!"
                                }
                            }
                        }) {
                            Icon(Icons.Default.Search, contentDescription = "Search", tint = NeonPurplePrimary)
                        }
                    }
                )

                if (verificationMessage != null) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isVerifiedAvailable) Color(0xFF064E3B).copy(alpha = 0.5f) else Color(0xFF7F1D1D).copy(alpha = 0.5f))
                            .padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(
                                imageVector = if (isVerifiedAvailable) Icons.Default.CheckCircle else Icons.Default.Lock,
                                contentDescription = null,
                                tint = if (isVerifiedAvailable) NeonEmerald else Color(0xFFF87171),
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = verificationMessage ?: "",
                                fontSize = 11.sp,
                                color = Color.White,
                                modifier = Modifier.weight(1f, fill = false)
                            )
                        }
                        if (isVerifiedAvailable && searchInput.trim().isNotEmpty()) {
                            Button(
                                onClick = {
                                    onBuyProduct("domain", searchInput.trim(), searchInput.trim(), 3850.0)
                                },
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                            ) {
                                Text("Buy Rs. 3,850", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        // TLD Category Quick Buttons
        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                Text(
                    text = "POPULAR EXTENSIONS",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    val tlds = listOf(".com", ".lk", ".net", ".org", ".site", ".online", ".xyz", "Custom")
                    items(tlds) { tld ->
                        Surface(
                            modifier = Modifier
                                .clip(RoundedCornerShape(10.dp))
                                .border(1.dp, GlassBorder, RoundedCornerShape(10.dp))
                                .clickable { onNavigate("domains") },
                            color = DarkSurface.copy(alpha = 0.7f)
                        ) {
                            Text(
                                text = tld,
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        }

        // Featured Domains
        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "VERIFIED DOMAINS FOR SALE",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "View All →",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = NeonViolet,
                        modifier = Modifier.clickable { onNavigate("domains") }
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(domains.take(5)) { domain ->
                        DomainCardItem(domain = domain, onBuy = {
                            onBuyProduct("domain", domain.name, domain.name, domain.price)
                        })
                    }
                }
            }
        }

        // Top APIs & Bots Showcase
        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "APIs & WHATSAPP MINI BOTS",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    letterSpacing = 1.sp
                )

                // WhatsApp Cloud API promo card
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .border(1.dp, GlassBorder, RoundedCornerShape(16.dp)),
                    color = DarkSurfaceElevated.copy(alpha = 0.75f)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(Icons.Default.CloudQueue, contentDescription = null, tint = NeonPurplePrimary)
                            Text("WhatsApp Cloud API Bridge", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            "Zero ban-risk official Meta webhook integration with template triggers and dispatcher.",
                            fontSize = 11.sp,
                            color = TextSecondary
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Rs. 6,500", fontWeight = FontWeight.Black, fontSize = 16.sp, color = NeonPinkAccent)
                            Button(
                                onClick = { onNavigate("apis") },
                                colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text("Explore APIs", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DomainCardItem(domain: DomainItem, onBuy: () -> Unit) {
    val isAvailable = domain.status == "available"
    Surface(
        modifier = Modifier
            .width(220.dp)
            .clip(RoundedCornerShape(18.dp))
            .border(1.dp, GlassBorder, RoundedCornerShape(18.dp)),
        color = DarkSurface.copy(alpha = 0.85f)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = domain.tld,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = NeonPurplePrimary,
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(Color.Black.copy(alpha = 0.5f))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                )
                Text(
                    text = if (isAvailable) "Verified" else domain.status,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isAvailable) NeonEmerald else Color(0xFFF87171)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = domain.name,
                fontSize = 16.sp,
                fontWeight = FontWeight.Black,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = domain.description,
                fontSize = 10.sp,
                color = TextSecondary,
                maxLines = 2
            )

            Spacer(modifier = Modifier.height(14.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Rs. ${domain.price.toInt()}",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Black,
                    color = NeonPinkAccent
                )
                Button(
                    onClick = onBuy,
                    enabled = isAvailable,
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(if (isAvailable) "Buy" else "Sold", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

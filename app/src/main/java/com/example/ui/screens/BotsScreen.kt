package com.example.ui.screens

import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Message
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.models.BotItem
import com.example.data.repository.DomainSellRepository
import com.example.ui.theme.*

@Composable
fun BotsScreen(
    repository: DomainSellRepository,
    onBuyBot: (BotItem) -> Unit
) {
    val context = LocalContext.current
    val bots by repository.bots.collectAsState()
    var selectedSetupBot by remember { mutableStateOf<BotItem?>(null) }

    fun openWhatsAppDemo(botName: String) {
        try {
            val url = "https://wa.me/${repository.adminWhatsApp}?text=" + Uri.encode("Hello DOMAIN SELL Admin. I would like to test the live demo for: $botName")
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
            context.startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(context, "Could not open WhatsApp", Toast.LENGTH_SHORT).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Text(
            text = "WHATSAPP MINI BOTS",
            fontSize = 24.sp,
            fontWeight = FontWeight.Black,
            color = Color.White
        )
        Text(
            text = "Official Meta Cloud API automated commerce and support assistants",
            fontSize = 12.sp,
            color = TextSecondary
        )

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(14.dp),
            contentPadding = PaddingValues(bottom = 90.dp)
        ) {
            items(bots) { bot ->
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
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
                                text = bot.name,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = "Meta Cloud",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = NeonPinkAccent,
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(Color.Black.copy(alpha = 0.5f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = bot.description,
                            fontSize = 11.sp,
                            color = TextSecondary
                        )

                        Spacer(modifier = Modifier.height(10.dp))
                        Text("Capabilities:", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = NeonPurplePrimary)
                        Spacer(modifier = Modifier.height(4.dp))
                        bot.features.forEach { feat ->
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Icon(Icons.Default.Check, contentDescription = null, tint = NeonEmerald, modifier = Modifier.size(12.dp))
                                Text(text = feat, fontSize = 11.sp, color = TextPrimary)
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Deployment Package", fontSize = 9.sp, color = TextMuted)
                                Text(
                                    text = "Rs. ${bot.price.toInt()}",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Black,
                                    color = NeonPinkAccent
                                )
                            }

                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                OutlinedButton(
                                    onClick = { selectedSetupBot = bot },
                                    shape = RoundedCornerShape(10.dp),
                                    border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(GlassBorder)),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Text("Setup", fontSize = 11.sp, color = Color.White)
                                }
                                Button(
                                    onClick = { openWhatsAppDemo(bot.name) },
                                    shape = RoundedCornerShape(10.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF065F46)),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Icon(Icons.Default.Message, contentDescription = null, modifier = Modifier.size(12.dp), tint = Color.White)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Demo", fontSize = 11.sp, color = Color.White)
                                }
                                Button(
                                    onClick = { onBuyBot(bot) },
                                    shape = RoundedCornerShape(10.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Text("Buy", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (selectedSetupBot != null) {
        val bot = selectedSetupBot!!
        AlertDialog(
            onDismissRequest = { selectedSetupBot = null },
            confirmButton = {
                Button(
                    onClick = {
                        val toBuy = bot
                        selectedSetupBot = null
                        onBuyBot(toBuy)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary)
                ) {
                    Text("Order This Bot")
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedSetupBot = null }) {
                    Text("Close", color = TextSecondary)
                }
            },
            title = {
                Text(bot.name, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Setup Guide & Meta Integration:", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = NeonPurplePrimary)
                    Text(
                        text = bot.setupInstructions,
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace,
                        color = Color.White,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color.Black)
                            .padding(10.dp)
                    )
                }
            },
            containerColor = DarkSurfaceElevated
        )
    }
}

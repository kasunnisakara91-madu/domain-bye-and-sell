package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.models.ApiItem
import com.example.data.repository.DomainSellRepository
import com.example.ui.theme.*

@Composable
fun ApisScreen(
    repository: DomainSellRepository,
    onBuyApi: (ApiItem) -> Unit
) {
    val apis by repository.apis.collectAsState()
    var selectedCategory by remember { mutableStateOf("All") }
    var selectedDocApi by remember { mutableStateOf<ApiItem?>(null) }

    val categories = listOf(
        "All",
        "WhatsApp APIs",
        "AI APIs",
        "Movie APIs",
        "Music APIs",
        "Social Media APIs",
        "Image APIs",
        "Video APIs",
        "Custom APIs"
    )

    val filtered = if (selectedCategory == "All") apis else apis.filter { it.category == selectedCategory }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Text(
            text = "API MARKETPLACE",
            fontSize = 24.sp,
            fontWeight = FontWeight.Black,
            color = Color.White
        )
        Text(
            text = "High-speed backend microservices & AI bridges",
            fontSize = 12.sp,
            color = TextSecondary
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Categories Row
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(categories) { cat ->
                val isSelected = selectedCategory == cat
                Surface(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .border(
                            1.dp,
                            if (isSelected) NeonPurplePrimary else GlassBorder,
                            RoundedCornerShape(10.dp)
                        )
                        .clickable { selectedCategory = cat },
                    color = if (isSelected) NeonPurplePrimary else DarkSurface.copy(alpha = 0.7f)
                ) {
                    Text(
                        text = cat,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // List
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(bottom = 90.dp)
        ) {
            items(filtered) { api ->
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .border(1.dp, GlassBorder, RoundedCornerShape(16.dp)),
                    color = DarkSurface.copy(alpha = 0.85f)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = api.name,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = api.category,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = NeonPurplePrimary,
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(Color.Black.copy(alpha = 0.5f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = api.description,
                            fontSize = 11.sp,
                            color = TextSecondary
                        )

                        Spacer(modifier = Modifier.height(8.dp))
                        // Features
                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            api.features.take(2).forEach { feat ->
                                Text(
                                    text = "• $feat",
                                    fontSize = 10.sp,
                                    color = NeonViolet
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Rs. ${api.price.toInt()}",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black,
                                color = NeonPinkAccent
                            )

                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                OutlinedButton(
                                    onClick = { selectedDocApi = api },
                                    shape = RoundedCornerShape(10.dp),
                                    border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(GlassBorder))
                                ) {
                                    Text("Docs", fontSize = 11.sp, color = Color.White)
                                }
                                Button(
                                    onClick = { onBuyApi(api) },
                                    shape = RoundedCornerShape(10.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary)
                                ) {
                                    Text("Buy API", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Docs Dialog
    if (selectedDocApi != null) {
        val api = selectedDocApi!!
        AlertDialog(
            onDismissRequest = { selectedDocApi = null },
            confirmButton = {
                Button(
                    onClick = {
                        val toBuy = api
                        selectedDocApi = null
                        onBuyApi(toBuy)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary)
                ) {
                    Text("Proceed to Order")
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedDocApi = null }) {
                    Text("Close", color = TextSecondary)
                }
            },
            title = {
                Text(api.name, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.White)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(api.description, fontSize = 11.sp, color = TextSecondary)
                    Text("Endpoint:", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = NeonPurplePrimary)
                    Text(
                        text = "POST https://api.domainsell.net${api.endpoint}",
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace,
                        color = Color.White,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(6.dp))
                            .background(Color.Black)
                            .padding(8.dp)
                    )
                    Text("Sample Payload:", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = NeonPurplePrimary)
                    Text(
                        text = api.sampleRequest,
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace,
                        color = NeonEmerald,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(6.dp))
                            .background(Color.Black)
                            .padding(8.dp)
                    )
                }
            },
            containerColor = DarkSurfaceElevated
        )
    }
}

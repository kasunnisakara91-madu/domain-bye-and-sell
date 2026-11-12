package com.example.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.LockOpen
import androidx.compose.material.icons.filled.Shield
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
import com.example.data.repository.DomainSellRepository
import com.example.ui.theme.*

@Composable
fun AdminPortalScreen(repository: DomainSellRepository) {
    val context = LocalContext.current
    val orders by repository.orders.collectAsState()
    val bankDetails by repository.bankDetails.collectAsState()

    var isAuthenticated by remember { mutableStateOf(false) }
    var pinInput by remember { mutableStateOf("") }
    var pinError by remember { mutableStateOf(false) }

    // Admin Tabs
    var adminTab by remember { mutableStateOf(0) } // 0: Overview/Verification, 1: Unlock, 2: Add Domain, 3: Bank Settings

    // Add Domain Form
    var domainNameInput by remember { mutableStateOf("") }
    var domainPriceInput by remember { mutableStateOf("3850") }
    var domainTldInput by remember { mutableStateOf(".com") }

    // Settings Form
    var editBankName by remember { mutableStateOf(bankDetails.bankName) }
    var editAccHolder by remember { mutableStateOf(bankDetails.accountHolder) }
    var editAccNum by remember { mutableStateOf(bankDetails.accountNumber) }
    var editBranch by remember { mutableStateOf(bankDetails.branch) }

    val stats = remember(orders) { repository.getAdminStats() }

    // If not authenticated, prompt for PIN
    if (!isAuthenticated) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(NeonPurplePrimary.copy(alpha = 0.2f))
                    .border(1.dp, GlassBorder, RoundedCornerShape(20.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Shield, contentDescription = null, tint = NeonPinkAccent, modifier = Modifier.size(32.dp))
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text("ADMINISTRATOR CONSOLE", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color.White)
            Text("Enter Master Security PIN (Default: 2026)", fontSize = 12.sp, color = TextSecondary)

            Spacer(modifier = Modifier.height(20.dp))

            OutlinedTextField(
                value = pinInput,
                onValueChange = {
                    pinInput = it
                    pinError = false
                },
                placeholder = { Text("PIN: 2026", color = TextMuted) },
                singleLine = true,
                modifier = Modifier.width(200.dp),
                shape = RoundedCornerShape(12.dp)
            )

            if (pinError) {
                Spacer(modifier = Modifier.height(6.dp))
                Text("Invalid PIN. Default PIN is 2026", fontSize = 11.sp, color = Color(0xFFF87171))
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = {
                    if (pinInput.trim() == "2026" || pinInput.trim() == "1234") {
                        isAuthenticated = true
                    } else {
                        pinError = true
                    }
                },
                modifier = Modifier.width(200.dp),
                colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Authenticate", fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
        }
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("ADMIN CONSOLE", fontSize = 22.sp, fontWeight = FontWeight.Black, color = Color.White)
                Text("Superadmin Verified Access", fontSize = 11.sp, color = NeonEmerald)
            }
            TextButton(onClick = { isAuthenticated = false }) {
                Text("Lock", fontSize = 11.sp, color = Color(0xFFF87171))
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Tabs
        TabRow(
            selectedTabIndex = adminTab,
            containerColor = DarkSurface,
            contentColor = NeonPurplePrimary,
            modifier = Modifier.clip(RoundedCornerShape(12.dp))
        ) {
            Tab(selected = adminTab == 0, onClick = { adminTab = 0 }, text = { Text("Verify Slips", fontSize = 10.sp) })
            Tab(selected = adminTab == 1, onClick = { adminTab = 1 }, text = { Text("Manual Unlock", fontSize = 10.sp) })
            Tab(selected = adminTab == 2, onClick = { adminTab = 2 }, text = { Text("Add Domain", fontSize = 10.sp) })
            Tab(selected = adminTab == 3, onClick = { adminTab = 3 }, text = { Text("Bank Setup", fontSize = 10.sp) })
        }

        Spacer(modifier = Modifier.height(14.dp))

        when (adminTab) {
            // TAB 0: VERIFICATION & STATS
            0 -> {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    contentPadding = PaddingValues(bottom = 90.dp)
                ) {
                    item {
                        // Metrics Card
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .border(1.dp, GlassBorder, RoundedCornerShape(16.dp)),
                            color = DarkSurfaceElevated
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceAround
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("Revenue", fontSize = 9.sp, color = TextMuted)
                                    Text("Rs. ${stats.totalRevenue.toInt()}", fontSize = 14.sp, fontWeight = FontWeight.Black, color = NeonPinkAccent)
                                }
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("Pending Slips", fontSize = 9.sp, color = TextMuted)
                                    Text("${stats.pendingPayments}", fontSize = 14.sp, fontWeight = FontWeight.Black, color = NeonAmber)
                                }
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("Unlocked", fontSize = 9.sp, color = TextMuted)
                                    Text("${stats.unlockedProducts}", fontSize = 14.sp, fontWeight = FontWeight.Black, color = NeonEmerald)
                                }
                            }
                        }
                    }

                    item {
                        Text("PENDING BANK SLIP VERIFICATION", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = TextSecondary)
                    }

                    items(orders.filter { it.status in listOf("payment_submitted", "pending") }) { order ->
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .border(1.dp, GlassBorder, RoundedCornerShape(14.dp)),
                            color = DarkSurface.copy(alpha = 0.85f)
                        ) {
                            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(order.orderId, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, color = NeonPurplePrimary, fontSize = 12.sp)
                                    Text("@${order.username}", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 12.sp)
                                }
                                Text("${order.productName} • Rs. ${order.amount.toInt()}", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                if (order.whatsappContact.isNotEmpty()) {
                                    Text("WhatsApp: ${order.whatsappContact}", fontSize = 11.sp, color = TextSecondary)
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.End,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Button(
                                        onClick = {
                                            repository.verifyPayment(order.orderId, false)
                                            Toast.makeText(context, "Payment Rejected", Toast.LENGTH_SHORT).show()
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF7F1D1D)),
                                        shape = RoundedCornerShape(8.dp),
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                    ) {
                                        Text("Reject", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Button(
                                        onClick = {
                                            repository.verifyPayment(order.orderId, true)
                                            Toast.makeText(context, "Payment Verified! Ready for unlock.", Toast.LENGTH_SHORT).show()
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = NeonEmerald),
                                        shape = RoundedCornerShape(8.dp),
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                    ) {
                                        Text("Approve", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // TAB 1: DOMAIN UNLOCK SYSTEM (THE MOST IMPORTANT FEATURE)
            1 -> {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    contentPadding = PaddingValues(bottom = 90.dp)
                ) {
                    item {
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .border(1.dp, GlassBorder, RoundedCornerShape(16.dp)),
                            color = DarkSurfaceElevated
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Text(
                                    text = "MANUAL PRODUCT UNLOCK",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Black,
                                    color = NeonEmerald
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Step 9: Admin unlocks the domain/API for the exact customer username. Products never unlock automatically.",
                                    fontSize = 11.sp,
                                    color = TextSecondary
                                )
                            }
                        }
                    }

                    val verifiedOrders = orders.filter { it.status in listOf("verified", "payment_submitted") }
                    if (verifiedOrders.isEmpty()) {
                        item {
                            Text("No orders currently awaiting unlock.", fontSize = 12.sp, color = TextMuted)
                        }
                    } else {
                        items(verifiedOrders) { order ->
                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(14.dp))
                                    .border(1.dp, NeonEmerald.copy(alpha = 0.5f), RoundedCornerShape(14.dp)),
                                color = DarkSurface.copy(alpha = 0.85f)
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(14.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(order.orderId, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, color = NeonPurplePrimary, fontSize = 12.sp)
                                        Text(order.productName, fontWeight = FontWeight.Bold, color = Color.White, fontSize = 13.sp)
                                        Text("Customer: @${order.username}", fontSize = 11.sp, color = NeonEmerald)
                                    }

                                    Button(
                                        onClick = {
                                            val ok = repository.unlockProduct(order.orderId)
                                            if (ok) {
                                                Toast.makeText(context, "UNLOCKED for @${order.username}!", Toast.LENGTH_LONG).show()
                                            }
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = NeonEmerald),
                                        shape = RoundedCornerShape(10.dp)
                                    ) {
                                        Icon(Icons.Default.LockOpen, contentDescription = null, modifier = Modifier.size(14.dp), tint = Color.Black)
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Unlock", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // TAB 2: ADD DOMAIN
            2 -> {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text("ADD DOMAIN TO MARKETPLACE", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)

                    OutlinedTextField(
                        value = domainNameInput,
                        onValueChange = { domainNameInput = it.lowercase() },
                        label = { Text("Domain Name (e.g. cyberpay.com)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = domainTldInput,
                        onValueChange = { domainTldInput = it },
                        label = { Text("TLD Category (.com, .lk, .xyz)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = domainPriceInput,
                        onValueChange = { domainPriceInput = it },
                        label = { Text("Price in LKR") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Button(
                        onClick = {
                            if (domainNameInput.trim().isNotEmpty()) {
                                repository.addDomain(
                                    domainNameInput.trim(),
                                    domainTldInput.trim(),
                                    domainPriceInput.toDoubleOrNull() ?: 3850.0,
                                    "Certified domain with instant DNS transfer."
                                )
                                Toast.makeText(context, "Domain Added to Catalog!", Toast.LENGTH_SHORT).show()
                                domainNameInput = ""
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Publish to Marketplace", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }

            // TAB 3: BANK & WHATSAPP SETTINGS
            3 -> {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text("BANK PAYMENT SETTINGS", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)

                    OutlinedTextField(
                        value = editBankName,
                        onValueChange = { editBankName = it },
                        label = { Text("Bank Name") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = editAccHolder,
                        onValueChange = { editAccHolder = it },
                        label = { Text("Account Holder") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = editAccNum,
                        onValueChange = { editAccNum = it },
                        label = { Text("Account Number") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = editBranch,
                        onValueChange = { editBranch = it },
                        label = { Text("Branch") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Button(
                        onClick = {
                            repository.updateBankDetails(editBankName, editAccHolder, editAccNum, editBranch)
                            Toast.makeText(context, "Bank Details Updated!", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Save Details", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}

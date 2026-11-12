package com.example.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Message
import androidx.compose.material.icons.filled.Upload
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
fun BankPaymentScreen(
    repository: DomainSellRepository,
    initialOrderId: String = "",
    initialAmount: Double = 0.0,
    initialProductName: String = "",
    initialDomainName: String = ""
) {
    val context = LocalContext.current
    val bankDetails by repository.bankDetails.collectAsState()
    val currentUsername by repository.currentUsername.collectAsState()

    var orderId by remember { mutableStateOf(initialOrderId) }
    var username by remember { mutableStateOf(currentUsername) }
    var productName by remember { mutableStateOf(initialProductName) }
    var domainName by remember { mutableStateOf(initialDomainName) }
    var amount by remember { mutableStateOf(if (initialAmount > 0) initialAmount.toInt().toString() else "") }
    var whatsappNumber by remember { mutableStateOf("+94 ") }
    var copied by remember { mutableStateOf(false) }
    var submitted by remember { mutableStateOf(false) }

    fun copyToClipboard(text: String) {
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("Account Number", text)
        clipboard.setPrimaryClip(clip)
        copied = true
        Toast.makeText(context, "Account number copied to clipboard", Toast.LENGTH_SHORT).show()
    }

    fun openWhatsAppSubmission() {
        try {
            val message = """
                Hello DOMAIN SELL Admin.
                Username: ${username.ifEmpty { "N/A" }}
                Product: ${productName.ifEmpty { "Order " + orderId }}
                Domain: ${domainName.ifEmpty { "N/A" }}
                Amount: Rs. $amount
                Order ID: ${orderId.ifEmpty { "DS-NEW" }}
                I have completed my bank transfer.
                My payment receipt is attached.
            """.trimIndent()

            val url = "https://wa.me/${repository.adminWhatsApp}?text=" + Uri.encode(message)
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
            context.startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(context, "Could not launch WhatsApp", Toast.LENGTH_SHORT).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "BANK PAYMENT SYSTEM",
            fontSize = 24.sp,
            fontWeight = FontWeight.Black,
            color = Color.White
        )
        Text(
            text = "Direct transfer verification. Strictly no credit card processors.",
            fontSize = 12.sp,
            color = TextSecondary
        )

        // Bank Details Card
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .border(1.dp, GlassBorder, RoundedCornerShape(20.dp)),
            color = DarkSurface.copy(alpha = 0.9f)
        ) {
            Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "RECEIVING BANK ACCOUNT",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = NeonPurplePrimary,
                    letterSpacing = 1.sp
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Bank Name", fontSize = 10.sp, color = TextMuted)
                        Text(bankDetails.bankName, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                    Text(
                        text = "Official Account",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = NeonEmerald,
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(Color(0xFF064E3B).copy(alpha = 0.5f))
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Account Holder", fontSize = 10.sp, color = TextMuted)
                        Text(bankDetails.accountHolder, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = NeonPurplePrimary)
                    }
                }

                // Account Number with 1-click Copy
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color.Black.copy(alpha = 0.6f))
                        .padding(12.dp),
                    color = Color.Transparent
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Account Number", fontSize = 10.sp, color = TextMuted)
                            Text(
                                text = bankDetails.accountNumber,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                fontFamily = FontFamily.Monospace,
                                color = NeonEmerald
                            )
                        }

                        Button(
                            onClick = { copyToClipboard(bankDetails.accountNumber) },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Icon(
                                imageVector = if (copied) Icons.Default.Check else Icons.Default.ContentCopy,
                                contentDescription = null,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(if (copied) "Copied" else "Copy", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("Branch", fontSize = 10.sp, color = TextMuted)
                        Text(bankDetails.branch, fontSize = 13.sp, color = Color.White)
                    }
                }
            }
        }

        // Receipt Submission Form
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .border(1.dp, GlassBorder, RoundedCornerShape(20.dp)),
            color = DarkSurfaceElevated.copy(alpha = 0.85f)
        ) {
            Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(
                    text = "SUBMIT BANK TRANSFER RECEIPT",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = NeonPinkAccent,
                    letterSpacing = 1.sp
                )

                if (submitted) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color(0xFF064E3B).copy(alpha = 0.5f))
                            .padding(14.dp)
                    ) {
                        Text(
                            text = "Payment slip logged for Order $orderId! Admin will verify and unlock your product.",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }

                OutlinedTextField(
                    value = orderId,
                    onValueChange = { orderId = it },
                    label = { Text("Order ID") },
                    placeholder = { Text("e.g. DS-94821") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp)
                )

                OutlinedTextField(
                    value = username,
                    onValueChange = { username = it },
                    label = { Text("Customer Username") },
                    placeholder = { Text("e.g. kasun_dev") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp)
                )

                OutlinedTextField(
                    value = amount,
                    onValueChange = { amount = it },
                    label = { Text("Transferred Amount (LKR)") },
                    placeholder = { Text("e.g. 4200") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp)
                )

                OutlinedTextField(
                    value = whatsappNumber,
                    onValueChange = { whatsappNumber = it },
                    label = { Text("WhatsApp Contact Number") },
                    placeholder = { Text("+94 77 123 4567") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp)
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = {
                            if (orderId.trim().isNotEmpty() && amount.trim().isNotEmpty()) {
                                repository.submitReceipt(orderId.trim(), whatsappNumber.trim())
                                submitted = true
                                Toast.makeText(context, "Receipt submitted for verification!", Toast.LENGTH_SHORT).show()
                            } else {
                                Toast.makeText(context, "Please enter order ID and amount", Toast.LENGTH_SHORT).show()
                            }
                        },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = NeonPurplePrimary),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Upload, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Log Receipt", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }

                    Button(
                        onClick = { openWhatsAppSubmission() },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF059669)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Message, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("WhatsApp", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
